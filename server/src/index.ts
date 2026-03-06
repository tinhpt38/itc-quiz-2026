/**
 * Server ứng dụng thi trắc nghiệm - mota.md
 * Bun + SQLite, Heart-beat (polling), không gửi đáp án đúng xuống Client.
 */

import { db } from "./db/index.js";
import * as subjects from "./routes/subjects";
import * as questions from "./routes/questions";
import * as exams from "./routes/exams";
import * as heartbeat from "./routes/heartbeat";
import * as auth from "./routes/auth";
import { generateSheetsForExam, getSheetForStudent } from "./services/sheets";
import { finalizeSheet, finalizeAllSheetsForExam, getResultForStudent } from "./services/scoring";
import { importFromJsonFile, importFromBankFolder, importAikenToSubject } from "./services/importBank";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = parseInt(process.env.PORT ?? "3000", 10);

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": CORS_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function parseBody<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

const server = Bun.serve({
  hostname: HOST,
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // --- Health
      if (path === "/" || path === "/health") return json({ ok: true, service: "itc-quiz-server" });

      // --- Subjects (Admin)
      if (path === "/api/subjects" && method === "GET") return json(subjects.listSubjects());
      if (path === "/api/subjects" && method === "POST") {
        const b = await parseBody<{ name: string; code?: string }>(req);
        if (!b?.name) return json({ error: "name required" }, 400);
        return json(subjects.createSubject(b.name, b.code));
      }
      const subjectMatch = path.match(/^\/api\/subjects\/(\d+)$/);
      if (subjectMatch && method === "GET") {
        const sub = subjects.getSubject(parseInt(subjectMatch[1], 10));
        return sub ? json(sub) : json({ error: "Not found" }, 404);
      }
      if (subjectMatch && method === "PUT") {
        const b = await parseBody<{ name: string; code?: string }>(req);
        if (!b?.name) return json({ error: "name required" }, 400);
        const updated = subjects.updateSubject(parseInt(subjectMatch[1], 10), b.name, b.code);
        return updated ? json(updated) : json({ error: "Not found" }, 404);
      }
      if (subjectMatch && method === "DELETE") {
        subjects.deleteSubject(parseInt(subjectMatch[1], 10));
        return json({ ok: true });
      }
      const subjectCountMatch = path.match(/^\/api\/subjects\/(\d+)\/question-count$/);
      if (subjectCountMatch && method === "GET") {
        const n = subjects.countQuestionsBySubject(parseInt(subjectCountMatch[1], 10));
        return json({ count: n });
      }

      // --- Categories theo môn học (Module 1-6 → category tùy chỉnh)
      const catCountMatch = path.match(/^\/api\/subjects\/(\d+)\/categories\/(\d+)\/question-count$/);
      if (catCountMatch && method === "GET") {
        const n = subjects.countQuestionsByCategory(parseInt(catCountMatch[2], 10));
        return json({ count: n });
      }
      const subCatMatch = path.match(/^\/api\/subjects\/(\d+)\/categories\/?(\d*)$/);
      if (subCatMatch && method === "GET" && !subCatMatch[2]) {
        return json(subjects.listCategories(parseInt(subCatMatch[1], 10)));
      }
      if (subCatMatch && method === "POST" && !subCatMatch[2]) {
        const b = await parseBody<{ name: string; sort_order?: number; parent_id?: number | null }>(req);
        if (!b?.name) return json({ error: "name required" }, 400);
        const row = subjects.createCategory(parseInt(subCatMatch[1], 10), b.name, { sortOrder: b.sort_order, parent_id: b.parent_id });
        return json(row);
      }
      if (subCatMatch && subCatMatch[2] && (method === "PUT" || method === "DELETE")) {
        const subjectId = parseInt(subCatMatch[1], 10);
        const categoryId = parseInt(subCatMatch[2], 10);
        if (method === "PUT") {
          const b = await parseBody<{ name: string; sort_order?: number; parent_id?: number | null }>(req);
          if (!b?.name) return json({ error: "name required" }, 400);
          const row = subjects.updateCategory(categoryId, b.name, { sortOrder: b.sort_order, parent_id: b.parent_id });
          return row ? json(row) : json({ error: "Not found" }, 404);
        }
        const r = subjects.deleteCategory(subjectId, categoryId);
        if (r.changes === 0) return json({ error: "Not found or wrong subject" }, 404);
        return json({ ok: true });
      }

      // --- Cấp độ theo môn học
      const levCountMatch = path.match(/^\/api\/subjects\/(\d+)\/levels\/(\d+)\/question-count$/);
      if (levCountMatch && method === "GET") {
        const n = subjects.countQuestionsByLevel(parseInt(levCountMatch[2], 10));
        return json({ count: n });
      }
      const subLevMatch = path.match(/^\/api\/subjects\/(\d+)\/levels\/?(\d*)$/);
      if (subLevMatch && method === "GET" && !subLevMatch[2]) {
        return json(subjects.listLevels(parseInt(subLevMatch[1], 10)));
      }
      if (subLevMatch && method === "POST" && !subLevMatch[2]) {
        const b = await parseBody<{ name: string; sort_order?: number }>(req);
        if (!b?.name) return json({ error: "name required" }, 400);
        const row = subjects.createLevel(parseInt(subLevMatch[1], 10), b.name, b.sort_order);
        return json(row);
      }
      if (subLevMatch && subLevMatch[2] && (method === "PUT" || method === "DELETE")) {
        const levelId = parseInt(subLevMatch[2], 10);
        if (method === "PUT") {
          const b = await parseBody<{ name: string; sort_order?: number }>(req);
          if (!b?.name) return json({ error: "name required" }, 400);
          const row = subjects.updateLevel(levelId, b.name, b.sort_order);
          return row ? json(row) : json({ error: "Not found" }, 404);
        }
        subjects.deleteLevel(levelId);
        return json({ ok: true });
      }

      // --- Questions (Admin: with answers; Client uses /api/exam/...)
      if (path.match(/^\/api\/subjects\/\d+\/questions/) && method === "GET") {
        const parts = path.split("/");
        const subjectId = parseInt(parts[3]!, 10);
        const level = url.searchParams.get("level");
        const module = url.searchParams.get("module");
        const level_id = url.searchParams.get("level_id");
        const category_id = url.searchParams.get("category_id");
        const opts =
          level_id || category_id
            ? { level_id: level_id ? parseInt(level_id, 10) : undefined, category_id: category_id ? parseInt(category_id, 10) : undefined }
            : { level: level ? parseInt(level, 10) : undefined, module: module ? parseInt(module, 10) : undefined };
        return json(questions.listQuestions(subjectId, opts));
      }
      if (path.startsWith("/api/questions/") && method === "GET") {
        const id = parseInt(path.replace("/api/questions/", ""), 10);
        const admin = url.searchParams.get("admin") === "1";
        const q = admin ? questions.getQuestionWithAnswersAdmin(id) : questions.getQuestionForExam(id);
        return q ? json(q) : json({ error: "Not found" }, 404);
      }
      if (path.match(/^\/api\/questions\/\d+$/) && method === "DELETE") {
        const id = parseInt(path.split("/")[3], 10);
        questions.deleteQuestion(id);
        return json({ ok: true });
      }
      if (path.match(/^\/api\/subjects\/\d+\/questions/) && method === "POST") {
        const subjectId = parseInt(path.split("/")[3], 10);
        const b = await parseBody<{
          text: string;
          level?: number;
          module?: number;
          category_id?: number;
          level_id?: number;
          answers: { text: string; isCorrect: boolean }[];
        }>(req);
        if (!b?.text || !b?.answers?.length) return json({ error: "text and answers required" }, 400);
        const id = questions.createQuestion(subjectId, b.text, b.answers, {
          level: b.level,
          module: b.module,
          category_id: b.category_id,
          level_id: b.level_id,
          scoreWeight: 1,
        });
        return json({ id });
      }

      // --- Import
      if (path === "/api/import/json" && method === "POST") {
        const b = await parseBody<{ filePath: string; subjectId: number }>(req);
        if (!b?.filePath || !b?.subjectId) return json({ error: "filePath and subjectId required" }, 400);
        const result = await importFromJsonFile(b.filePath, b.subjectId);
        return json(result);
      }
      if (path === "/api/import/bank" && method === "POST") {
        const b = await parseBody<{ bankPath?: string; subjectName?: string; subjectCode?: string }>(req);
        const bankPath = b?.bankPath ?? process.env.QUESTION_BANK_PATH ?? "../question-bank";
        const options = b?.subjectName || b?.subjectCode ? { subjectName: b.subjectName, subjectCode: b.subjectCode } : undefined;
        const result = await importFromBankFolder(bankPath, options);
        return json(result);
      }
      if (path === "/api/import/aiken" && method === "POST") {
        const b = await parseBody<{ content: string; subjectId: number }>(req);
        if (!b?.content || !b?.subjectId) return json({ error: "content and subjectId required" }, 400);
        const result = importAikenToSubject(b.content, b.subjectId);
        return json(result);
      }

      // --- Exams (Admin)
      if (path === "/api/exams" && method === "GET") return json(exams.listExams());
      if (path === "/api/exams" && method === "POST") {
        const b = await parseBody<Parameters<typeof exams.createExam>[0]>(req);
        if (!b?.subjectId || !b?.name || b?.durationMinutes == null) return json({ error: "subjectId, name, durationMinutes required" }, 400);
        return json(exams.createExam(b));
      }
      if (path.match(/^\/api\/exams\/(\d+)$/) && method === "GET") {
        const id = parseInt(path.split("/")[3], 10);
        const exam = exams.getExam(id);
        return exam ? json(exam) : json({ error: "Not found" }, 404);
      }
      if (path.match(/^\/api\/exams\/(\d+)\/status$/) && method === "PUT") {
        const id = parseInt(path.split("/")[3], 10);
        const b = await parseBody<{ status: "draft" | "active" | "ended" }>(req);
        if (!b?.status) return json({ error: "status required" }, 400);
        if (b.status === "active") {
          // Có thể set started_at ở đây
          const exam = exams.getExam(id);
          if (exam && !exam.started_at) {
            db.prepare("UPDATE exams SET started_at = datetime('now') WHERE id = ?").run(id);
          }
        }
        return json(exams.setExamStatus(id, b.status));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/rooms$/) && method === "GET") {
        const examId = parseInt(path.split("/")[3], 10);
        return json(exams.listExamRooms(examId));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/rooms$/) && method === "POST") {
        const examId = parseInt(path.split("/")[3], 10);
        const b = await parseBody<{ name: string }>(req);
        if (!b?.name) return json({ error: "name required" }, 400);
        return json(exams.addExamRoom(examId, b.name));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/students$/) && method === "GET") {
        const examId = parseInt(path.split("/")[3], 10);
        const roomId = url.searchParams.get("roomId");
        return json(exams.listExamStudents(examId, roomId ? parseInt(roomId, 10) : undefined));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/students$/) && method === "POST") {
        const examId = parseInt(path.split("/")[3], 10);
        const b = await parseBody<{ sbd: string; fullName?: string; baseScore?: number; roomId?: number }>(req);
        if (!b?.sbd) return json({ error: "sbd required" }, 400);
        return json(exams.addExamStudent(examId, b.sbd, b.fullName, b.baseScore, b.roomId));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/students\/batch$/) && method === "POST") {
        const examId = parseInt(path.split("/")[3], 10);
        const b = await parseBody<{ roomId?: number; students: { sbd: string; fullName?: string; baseScore?: number }[] }>(req);
        if (!b?.students || !Array.isArray(b.students)) return json({ error: "students array required" }, 400);
        return json(exams.addExamStudentsBatch(examId, b.students, b.roomId));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/students\/(\d+)\/base-score$/) && method === "PUT") {
        const parts = path.split("/");
        const studentIdStr = parts[5];
        const b = await parseBody<{ baseScore: number | null }>(req);
        return json(exams.updateExamStudentBaseScore(parseInt(studentIdStr!, 10), b?.baseScore ?? null));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/generate-sheets$/) && method === "POST") {
        const examId = parseInt(path.split("/")[3], 10);
        const b = await parseBody<{ totalQuestions: number }>(req);
        const total = b?.totalQuestions ?? 20;
        const result = generateSheetsForExam(examId, total);
        return json(result);
      }
      if (path.match(/^\/api\/exams\/(\d+)\/finalize$/) && method === "POST") {
        const examId = parseInt(path.split("/")[3], 10);
        const result = finalizeAllSheetsForExam(examId);
        return json(result);
      }

      // --- Monitor (Dashboard giám sát)
      if (path.match(/^\/api\/exams\/(\d+)\/monitor$/) && method === "GET") {
        const examId = parseInt(path.split("/")[3], 10);
        const roomId = url.searchParams.get("roomId");
        return json(heartbeat.getRoomMonitor(examId, roomId ? parseInt(roomId, 10) : undefined));
      }
      if (path.match(/^\/api\/exams\/(\d+)\/state$/) && method === "GET") {
        const examId = parseInt(path.split("/")[3], 10);
        const state = heartbeat.getExamState(examId);
        return state ? json(state) : json({ error: "Not found" }, 404);
      }

      // --- Client: login by SBD
      if (path === "/api/client/login" && method === "POST") {
        const b = await parseBody<{ examId: number; sbd: string }>(req);
        if (!b?.examId || !b?.sbd) return json({ ok: false, error: "examId and sbd required" }, 400);
        return json(auth.loginBySbd(b.examId, b.sbd));
      }
      if (path.match(/^\/api\/client\/sheet\/(\d+)$/) && method === "GET") {
        const sheetId = parseInt(path.split("/")[4], 10);
        const studentId = url.searchParams.get("studentId");
        if (!studentId) return json({ error: "studentId required" }, 400);
        const sheet = getSheetForStudent(sheetId, parseInt(studentId, 10));
        return sheet ? json(sheet) : json({ error: "Not found" }, 404);
      }
      if (path === "/api/client/question" && method === "GET") {
        const questionId = url.searchParams.get("questionId");
        const examSheetId = url.searchParams.get("examSheetId");
        const studentId = url.searchParams.get("studentId");
        if (!questionId || !examSheetId || !studentId) return json({ error: "questionId, examSheetId, studentId required" }, 400);
        const q = auth.getQuestionForExamApi(parseInt(questionId, 10), parseInt(examSheetId, 10), parseInt(studentId, 10));
        return q ? json(q) : json({ error: "Not found" }, 404);
      }

      // --- Heartbeat (Client polling)
      if (path === "/api/heartbeat" && method === "POST") {
        const b = await parseBody<heartbeat.HeartbeatPayload>(req);
        if (!b?.examSheetId) return json({ ok: false, error: "examSheetId required" }, 400);
        return json(heartbeat.heartbeat(b));
      }

      // --- Finalize single sheet (nộp bài / hết giờ)
      if (path.match(/^\/api\/client\/sheet\/(\d+)\/submit$/) && method === "POST") {
        const sheetId = parseInt(path.split("/")[4], 10);
        const b = await parseBody<{ studentId: number }>(req);
        if (!b?.studentId) return json({ error: "studentId required" }, 400);
        const sheet = db.query("SELECT student_id FROM exam_sheets WHERE id = ?").get(sheetId) as any;
        if (!sheet || sheet.student_id !== b.studentId) return json({ error: "Forbidden" }, 403);
        try {
          const result = finalizeSheet(sheetId);
          return json(result);
        } catch (e: any) {
          return json({ error: e.message ?? "Finalize failed" }, 400);
        }
      }
      if (path.match(/^\/api\/client\/result\/(\d+)$/) && method === "GET") {
        const sheetId = parseInt(path.split("/")[4], 10);
        const studentId = url.searchParams.get("studentId");
        if (!studentId) return json({ error: "studentId required" }, 400);
        const result = getResultForStudent(sheetId, parseInt(studentId, 10));
        return result ? json(result) : json({ error: "Not found" }, 404);
      }

      return json({ error: "Not found" }, 404);
    } catch (e: any) {
      console.error(e);
      return json({ error: e.message ?? "Internal error" }, 500);
    }
  },
});

console.log(`Server: http://${HOST}:${PORT}`);
