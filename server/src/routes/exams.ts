import { db } from "../db/index.js";

export type LevelConfig = Record<string, number>; // e.g. { "1": 30, "2": 50, "3": 20 } %

export function listExams() {
  return db.query(`
    SELECT e.id, e.subject_id, e.name, e.code, e.started_at, e.ended_at, e.duration_minutes, e.status, e.level_config, e.created_at,
           s.name as subject_name
    FROM exams e
    JOIN subjects s ON s.id = e.subject_id
    ORDER BY e.created_at DESC
  `).all();
}

export function createExam(params: {
  subjectId: number;
  name: string;
  code?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  durationMinutes: number;
  levelConfig?: LevelConfig | null;
}) {
  const levelConfigJson = params.levelConfig ? JSON.stringify(params.levelConfig) : null;
  const r = db.prepare(`
    INSERT INTO exams (subject_id, name, code, started_at, ended_at, duration_minutes, level_config)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.subjectId,
    params.name,
    params.code ?? null,
    params.startedAt ?? null,
    params.endedAt ?? null,
    params.durationMinutes,
    levelConfigJson
  );
  return { id: r.lastInsertRowid, ...params };
}

export function getExam(examId: number) {
  const row = db.query(`
    SELECT e.*, s.name as subject_name
    FROM exams e
    JOIN subjects s ON s.id = e.subject_id
    WHERE e.id = ?
  `).get(examId) as any;
  if (row && row.level_config) row.level_config = JSON.parse(row.level_config);
  return row;
}

export function setExamStatus(examId: number, status: "draft" | "active" | "ended") {
  db.prepare("UPDATE exams SET status = ? WHERE id = ?").run(status, examId);
  return getExam(examId);
}

export function listExamRooms(examId: number) {
  return db.query("SELECT id, exam_id, name, created_at FROM exam_rooms WHERE exam_id = ? ORDER BY id").all(examId);
}

export function addExamRoom(examId: number, name: string) {
  const r = db.prepare("INSERT INTO exam_rooms (exam_id, name) VALUES (?, ?)").run(examId, name);
  return { id: r.lastInsertRowid, exam_id: examId, name };
}

export function listExamStudents(examId: number, roomId?: number) {
  let sql = "SELECT id, exam_id, room_id, sbd, full_name, base_score, created_at FROM exam_students WHERE exam_id = ?";
  const params: (number | undefined)[] = [examId];
  if (roomId != null) {
    sql += " AND room_id = ?";
    params.push(roomId);
  }
  sql += " ORDER BY sbd";
  return db.query(sql).all(...params);
}

export function addExamStudent(examId: number, sbd: string, fullName?: string, baseScore?: number, roomId?: number) {
  const r = db.prepare(`
    INSERT INTO exam_students (exam_id, room_id, sbd, full_name, base_score) VALUES (?, ?, ?, ?, ?)
  `).run(examId, roomId ?? null, sbd, fullName ?? null, baseScore ?? null);
  return { id: r.lastInsertRowid, exam_id: examId, sbd, full_name: fullName, base_score: baseScore, room_id: roomId };
}

export function updateExamStudentBaseScore(studentId: number, baseScore: number | null) {
  db.prepare("UPDATE exam_students SET base_score = ? WHERE id = ?").run(baseScore, studentId);
  return db.query("SELECT id, exam_id, sbd, full_name, base_score FROM exam_students WHERE id = ?").get(studentId);
}

export function getExamStudentBySbd(examId: number, sbd: string) {
  return db.query("SELECT id, exam_id, room_id, sbd, full_name, base_score FROM exam_students WHERE exam_id = ? AND sbd = ?").get(examId, sbd) as any;
}

export function addExamStudentsBatch(examId: number, students: { sbd: string, fullName?: string, baseScore?: number }[], roomId?: number) {
  const stmt = db.prepare(`
    INSERT INTO exam_students (exam_id, room_id, sbd, full_name, base_score)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(exam_id, sbd) DO UPDATE SET
      full_name = excluded.full_name,
      base_score = COALESCE(excluded.base_score, exam_students.base_score)
  `);
  let count = 0;
  const insertMany = db.transaction((list) => {
    for (const st of list) {
      stmt.run(examId, roomId ?? null, st.sbd, st.fullName ?? null, st.baseScore ?? null);
      count++;
    }
  });
  insertMany(students);
  return { success: true, count };
}
