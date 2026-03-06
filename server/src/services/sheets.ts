/**
 * Tạo đề thi (exam_sheets) cho từng thí sinh: random câu hỏi theo level_config %.
 * Client chỉ nhận danh sách question_id, load nội dung từ API (không bao giờ nhận đáp án đúng).
 */

import { db } from "../db/index.js";

export type LevelConfig = Record<string, number>;

function pickByLevel(subjectId: number, countByLevel: { level: number; count: number }[], total: number, levelConfig: LevelConfig): number[] {
  const want: Record<number, number> = {};
  let sum = 0;
  for (const [k, pct] of Object.entries(levelConfig)) {
    const level = parseInt(k, 10);
    if (!(level >= 1 && level <= 3)) continue;
    const n = Math.round((total * pct) / 100);
    want[level] = n;
    sum += n;
  }
  if (sum < total) {
    const first = parseInt(Object.keys(levelConfig)[0] ?? "1", 10);
    want[first] = (want[first] ?? 0) + (total - sum);
  }
  const result: number[] = [];
  for (const { level, count } of countByLevel) {
    const need = Math.min(want[level] ?? 0, count);
    if (need <= 0) continue;
    const ids = db.query("SELECT id FROM questions WHERE subject_id = ? AND level = ? ORDER BY RANDOM() LIMIT ?")
      .all(subjectId, level, need) as { id: number }[];
    result.push(...ids.map((r) => r.id));
  }
  return result;
}

export function generateSheetsForExam(examId: number, totalQuestions: number) {
  const exam = db.query("SELECT id, subject_id, level_config FROM exams WHERE id = ?").get(examId) as any;
  if (!exam) throw new Error("Exam not found");
  const levelConfig: LevelConfig = exam.level_config ? JSON.parse(exam.level_config) : { "1": 34, "2": 33, "3": 33 };
  const countByLevel = db.query(
    "SELECT level, COUNT(*) as count FROM questions WHERE subject_id = ? GROUP BY level",
    exam.subject_id
  ).all() as { level: number; count: number }[];
  const available = countByLevel.reduce((s, r) => s + r.count, 0);
  if (available < totalQuestions) throw new Error(`Not enough questions: need ${totalQuestions}, have ${available}`);

  const students = db.query("SELECT id FROM exam_students WHERE exam_id = ?").all(examId) as { id: number }[];
  const insertSheet = db.prepare("INSERT OR REPLACE INTO exam_sheets (exam_id, student_id, question_ids) VALUES (?, ?, ?)");
  const subjectId = exam.subject_id;

  for (const st of students) {
    const levelCounts = db.query("SELECT level, COUNT(*) as count FROM questions WHERE subject_id = ? GROUP BY level").all(subjectId) as { level: number; count: number }[];
    const ids = pickByLevel(subjectId, levelCounts, totalQuestions, levelConfig);
    const shuffled = ids.sort(() => Math.random() - 0.5);
    insertSheet.run(examId, st.id, JSON.stringify(shuffled));
  }
  return { generated: students.length };
}

/** Lấy đề cho Client: chỉ trả về mảng question_id (và có thể gọi API từng câu để lấy text + đáp án không có is_correct). */
export function getSheetForStudent(examSheetId: number, studentId: number) {
  const row = db.query("SELECT id, exam_id, student_id, question_ids FROM exam_sheets WHERE id = ? AND student_id = ?").get(examSheetId, studentId) as any;
  if (!row) return null;
  return {
    sheetId: row.id,
    examId: row.exam_id,
    questionIds: JSON.parse(row.question_ids) as number[],
  };
}

export function getSheetIdByStudentAndExam(examId: number, studentId: number) {
  const row = db.query("SELECT id FROM exam_sheets WHERE exam_id = ? AND student_id = ?").get(examId, studentId) as { id: number } | undefined;
  return row?.id ?? null;
}
