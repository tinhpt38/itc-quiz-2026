import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "../db/index.js";

const app = new Elysia()
    .use(cors())
    .get("/api/health", () => ({ status: "ok" }))

    // ==========================================
    // QUESTION BANK API
    // ==========================================
    .get("/api/subjects", () => {
        return db.query("SELECT * FROM Subjects").all();
    })
    .post("/api/subjects", ({ body }) => {
        const { name, code } = body as { name: string; code: string };
        const stmt = db.query("INSERT INTO Subjects (name, code) VALUES (?, ?) RETURNING *");
        return stmt.get(name, code);
    })
    .get("/api/subjects/:subjectId/questions", ({ params: { subjectId } }) => {
        return db.query("SELECT * FROM Questions WHERE subject_id = ?").all(subjectId);
    })
    .post("/api/questions", ({ body }) => {
        const { subject_id, level, content, options, correct_answer } = body as any;
        const stmt = db.query(
            "INSERT INTO Questions (subject_id, level, content, options, correct_answer) VALUES (?, ?, ?, ?, ?) RETURNING *"
        );
        return stmt.get(subject_id, level, content, JSON.stringify(options), correct_answer);
    })
    .delete("/api/questions/:id", ({ params: { id } }) => {
        const stmt = db.query("DELETE FROM Questions WHERE id = ? RETURNING *");
        return stmt.get(id);
    })

    // ==========================================
    // EXAM & ROOM API
    // ==========================================
    .get("/api/exams", () => {
        return db.query("SELECT * FROM Exams").all();
    })
    .post("/api/exams", ({ body }) => {
        const { name, start_time, end_time, config } = body as any;
        const stmt = db.query(
            "INSERT INTO Exams (name, start_time, end_time, config) VALUES (?, ?, ?, ?) RETURNING *"
        );
        return stmt.get(name, start_time, end_time, JSON.stringify(config));
    })
    .get("/api/exams/:examId/rooms", ({ params: { examId } }) => {
        return db.query("SELECT * FROM Rooms WHERE exam_id = ?").all(examId);
    })
    .post("/api/rooms", ({ body }) => {
        const { exam_id, name } = body as any;
        const stmt = db.query("INSERT INTO Rooms (exam_id, name) VALUES (?, ?) RETURNING *");
        return stmt.get(exam_id, name);
    })
    .delete("/api/rooms/:id", ({ params: { id } }) => {
        const stmt = db.query("DELETE FROM Rooms WHERE id = ? RETURNING *");
        return stmt.get(id);
    })
    .post("/api/exams/:id/start", ({ params: { id } }) => {
        const exam = db.query("SELECT * FROM Exams WHERE id = ?").get(id) as any;
        if (!exam) return { error: "Exam not found" };
        if (exam.status !== 'PENDING') return { error: "Exam already started or closed" };

        const config = JSON.parse(exam.config);
        const { subject_id, easy, medium, hard } = config;

        // Fetch questions by level for this subject
        const getQuestions = (level: string, limit: number) => {
            return db.query(`SELECT id FROM Questions WHERE subject_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?`).all(subject_id, level, limit) as { id: number }[];
        };

        // Get Rooms for this exam
        const rooms = db.query("SELECT id FROM Rooms WHERE exam_id = ?").all(id) as any[];

        for (const room of rooms) {
            // Get all candidates in the room
            const candidates = db.query("SELECT id FROM Candidates WHERE room_id = ?").all(room.id) as any[];

            for (const candidate of candidates) {
                // Generate a random set of questions for each candidate
                const easyQs = getQuestions('EASY', easy || 0);
                const mediumQs = getQuestions('MEDIUM', medium || 0);
                const hardQs = getQuestions('HARD', hard || 0);

                // Combine and shuffle
                let allQs = [...easyQs, ...mediumQs, ...hardQs].map(q => q.id);
                allQs.sort(() => Math.random() - 0.5);

                // Insert into Results
                db.query("INSERT INTO Results (candidate_id, exam_id, questions, answers, score, status) VALUES (?, ?, ?, '[]', 0, 'IN-PROGRESS')")
                    .run(candidate.id, id, JSON.stringify(allQs));
            }
        }

        // Update exam status
        db.query("UPDATE Exams SET status = 'ACTIVE' WHERE id = ?").run(id);

        return { success: true, message: "Exam started" };
    })
    .get("/api/candidates/:sbd/exam-data", ({ params: { sbd } }) => {
        const candidate = db.query("SELECT * FROM Candidates WHERE sbd = ?").get(sbd) as any;
        if (!candidate) return { error: "SBD not found" };

        const room = db.query("SELECT exam_id FROM Rooms WHERE id = ?").get(candidate.room_id) as any;
        if (!room) return { error: "Room not found" };

        const result = db.query("SELECT * FROM Results WHERE candidate_id = ? AND exam_id = ?").get(candidate.id, room.exam_id) as any;
        if (!result) return { error: "Kỳ thi chưa bắt đầu hoặc bạn không có quyền tham gia." };

        const questionIds = JSON.parse(result.questions);

        // Fetch question content
        const placeholders = questionIds.map(() => '?').join(',');
        const questions = db.query(`SELECT id, content, options FROM Questions WHERE id IN (${placeholders})`).all(...questionIds) as any[];

        // Sort questions based on the generated order in questionIds
        const sortedQuestions = questionIds.map((qid: number) => {
            const q = questions.find((item: any) => item.id === qid);
            if (q) {
                q.options = JSON.parse(q.options);
            }
            return q;
        }).filter(Boolean);

        return {
            exam_id: room.exam_id,
            questions: sortedQuestions,
            saved_answers: JSON.parse(result.answers)
        };
    })

    // ==========================================
    // CANDIDATES & BASE SCORE API
    // ==========================================
    .get("/api/rooms/:roomId/candidates", ({ params: { roomId } }) => {
        return db.query("SELECT * FROM Candidates WHERE room_id = ?").all(roomId);
    })
    .post("/api/candidates", ({ body }) => {
        const { room_id, sbd, name } = body as any;
        const stmt = db.query("INSERT INTO Candidates (room_id, sbd, name) VALUES (?, ?, ?) RETURNING *");
        return stmt.get(room_id, sbd, name);
    })
    .patch("/api/candidates/:candidateId/base-score", ({ params: { candidateId }, body }) => {
        const { base_score } = body as { base_score: number | null };
        const stmt = db.query("UPDATE Candidates SET base_score = ? WHERE id = ? RETURNING *");
        return stmt.get(base_score, candidateId);
    })

    // ==========================================
    // HEART-BEAT API (POLLED EVERY 10S BY CLIENTS)
    // ==========================================
    .post("/api/heart-beat", ({ body }) => {
        const { sbd, current_answers, client_status, pc_name } = body as any;
        const now = new Date().toISOString();

        // 1. Verify SBD exists & get exam info
        const candidate = db.query("SELECT * FROM Candidates WHERE sbd = ?").get(sbd) as any;
        if (!candidate) return { error: "SBD không hợp lệ hoặc không tồn tại." };

        // 2. Prevent Duplicate Login & Check Collision
        if (candidate.pc_name && candidate.pc_name !== pc_name && client_status === 'LOGIN_ATTEMPT') {
            // Save collision info so the OLD pc knows someone tried to login
            db.query("UPDATE Candidates SET collision_pc = ? WHERE id = ?").run(pc_name, candidate.id);
            return { error: `SBD của bạn đang được đăng nhập tại máy ${candidate.pc_name}` };
        }

        let collisionWarning = null;
        if (candidate.collision_pc && candidate.pc_name === pc_name && client_status === 'ACTIVE') {
            collisionWarning = `Cảnh báo: Có một người khác vừa cố gắng đăng nhập vào SBD này từ máy ${candidate.collision_pc}`;
            // Clear warning after shown
            db.query("UPDATE Candidates SET collision_pc = NULL WHERE id = ?").run(candidate.id);
        }

        // 3. Update PC name active session & online status
        if (client_status === 'LOGIN_ATTEMPT' || client_status === 'ACTIVE') {
            db.query("UPDATE Candidates SET current_ip = ?, pc_name = ?, is_online = 1, last_active = ? WHERE id = ?").run(pc_name, pc_name, now, candidate.id);
        } else if (client_status === 'LOGOUT') {
            db.query("UPDATE Candidates SET is_online = 0 WHERE id = ?").run(candidate.id);
        }

        // 4. Upsert Results (Batching locally stored answers to Server)
        if (current_answers && current_answers.length > 0) {
            const result = db.query("SELECT id FROM Results WHERE candidate_id = ?").get(candidate.id) as any;
            if (result) {
                db.query("UPDATE Results SET answers = ? WHERE id = ?").run(JSON.stringify(current_answers), result.id);
            }
        }

        // 5. Return commands (Exam active status)
        const room = db.query("SELECT exam_id FROM Rooms WHERE id = ?").get(candidate.room_id) as any;
        const exam = room ? db.query("SELECT status, end_time FROM Exams WHERE id = ?").get(room.exam_id) as any : null;

        return {
            exam_status: exam?.status || 'PENDING', // PENDING | ACTIVE | CLOSED
            remaining_time: exam?.end_time || null,
            collision_warning: collisionWarning,
            message: "Sync OK"
        };
    })

    // ==========================================
    // SUBMIT API & MAGICAL BASE SCORE LOGIC
    // ==========================================
    .post("/api/submit", ({ body }) => {
        const { sbd, final_answers } = body as any;

        // 1. Authenticate Candidate
        const candidate = db.query("SELECT * FROM Candidates WHERE sbd = ?").get(sbd) as any;
        if (!candidate) return { error: "SBD not found" };

        const room = db.query("SELECT exam_id FROM Rooms WHERE id = ?").get(candidate.room_id) as any;
        if (!room) return { error: "Không tìm thấy phòng thi" };

        // Note: To calculate real score, we need the questions tied to this exam.
        // For now, in a real implementation we would fetch `correct_answer` from Questions table
        // structured for this exact exam.
        // Let's assume `final_answers` is an array of { question_id, selected_option_index }.

        let realScore = 0;
        let questionsCount = final_answers.length;

        // Simulate basic grading
        const modifiedAnswers = [...final_answers];
        const wrongAnswersIndexes: number[] = [];

        for (let i = 0; i < modifiedAnswers.length; i++) {
            const ans = modifiedAnswers[i];
            const q = db.query("SELECT correct_answer FROM Questions WHERE id = ?").get(ans.question_id) as any;
            if (q && q.correct_answer === ans.selected_option_index) {
                realScore += 1;
            } else {
                wrongAnswersIndexes.push(i);
            }
        }

        // Convert raw score to 10-point scale: (realScore / total) * 10
        let finalCalculatedScore = (realScore / questionsCount) * 10;

        // Magic: Check against Base Score
        if (candidate.base_score !== null && finalCalculatedScore < candidate.base_score) {
            // Manipulate score
            const pointsNeeded = candidate.base_score - finalCalculatedScore;
            const correctStridesNeeded = Math.ceil(pointsNeeded / (10 / questionsCount));

            // Randomly pick N wrong answers and fix them!
            for (let j = 0; j < correctStridesNeeded && wrongAnswersIndexes.length > 0; j++) {
                const rIdx = Math.floor(Math.random() * wrongAnswersIndexes.length);
                const ansIndexToFix = wrongAnswersIndexes[rIdx];

                // fetch correct option
                const qToFix = db.query("SELECT correct_answer FROM Questions WHERE id = ?").get(modifiedAnswers[ansIndexToFix].question_id) as any;
                if (qToFix) {
                    modifiedAnswers[ansIndexToFix].selected_option_index = qToFix.correct_answer;
                    realScore += 1; // Increment internal logic
                }

                // Remove from wrong pool
                wrongAnswersIndexes.splice(rIdx, 1);
            }
        }

        // Recalculate Final Score just to be sure after manipulation
        const finalStoredScore = (realScore / questionsCount) * 10;

        // 2. Save final Result to DB
        const existingResult = db.query("SELECT * FROM Results WHERE candidate_id = ? AND exam_id = ?").get(candidate.id, room.exam_id) as any;
        if (existingResult) {
            db.query("UPDATE Results SET answers = ?, score = ?, status = 'SUBMITTED' WHERE id = ?").run(JSON.stringify(modifiedAnswers), finalStoredScore, existingResult.id);
        } else {
            db.query("INSERT INTO Results (candidate_id, exam_id, answers, score, status) VALUES (?, ?, ?, ?, 'SUBMITTED')").run(candidate.id, room.exam_id, JSON.stringify(modifiedAnswers), finalStoredScore);
        }

        return { success: true, saved_score: finalStoredScore };
    });

export function startApiServer(port = process.env.PORT || 3000) {
    app.listen(port, () => {
        console.log(`🦊 Elysia API is running at http://${app.server?.hostname}:${app.server?.port}`);
    });
    return app;
}
