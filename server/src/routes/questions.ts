import { db } from "../db/index.js";

/**
 * Client KHÔNG bao giờ nhận is_correct (mota.md).
 * Chỉ dùng cho admin và khi chấm điểm trên server.
 */

export function listQuestions(subjectId: number, level?: number, module?: number) {
  let sql = `
    SELECT q.id, q.subject_id, q.module, q.text, q.level, q.score_weight, q.created_at
    FROM questions q
    WHERE q.subject_id = ?
  `;
  const params: (number | undefined)[] = [subjectId];
  if (level != null) {
    sql += " AND q.level = ?";
    params.push(level);
  }
  if (module != null) {
    sql += " AND q.module = ?";
    params.push(module);
  }
  sql += " ORDER BY q.module, q.level, q.id";
  return db.query(sql).all(...params);
}

/** Trả về câu hỏi + đáp án (chỉ dùng cho Admin, không gửi cho Client thi). */
export function getQuestionWithAnswersAdmin(questionId: number) {
  const q = db.query("SELECT id, subject_id, module, text, level, score_weight FROM questions WHERE id = ?").get(questionId) as any;
  if (!q) return null;
  const answers = db.query("SELECT id, text, sort_order, is_correct FROM question_answers WHERE question_id = ? ORDER BY sort_order").all(questionId) as any[];
  return { ...q, answers };
}

/** Cho Client: chỉ câu hỏi + danh sách đáp án (text), KHÔNG có is_correct. */
export function getQuestionForExam(questionId: number) {
  const q = db.query("SELECT id, module, text, level FROM questions WHERE id = ?").get(questionId) as any;
  if (!q) return null;
  const answers = db.query("SELECT id, text, sort_order FROM question_answers WHERE question_id = ? ORDER BY sort_order").all(questionId) as any[];
  return { ...q, answers: answers.map((a: any) => ({ id: a.id, text: a.text, sortOrder: a.sort_order })) };
}

export function createQuestion(subjectId: number, text: string, level: number, answers: { text: string; isCorrect: boolean }[], scoreWeight = 1, module = 1) {
  const run = db.transaction(() => {
    const r = db.prepare("INSERT INTO questions (subject_id, module, text, level, score_weight) VALUES (?, ?, ?, ?, ?)").run(subjectId, module, text, level, scoreWeight);
    const qId = r.lastInsertRowid as number;
    const ins = db.prepare("INSERT INTO question_answers (question_id, text, sort_order, is_correct) VALUES (?, ?, ?, ?)");
    answers.forEach((a, i) => ins.run(qId, a.text, i, a.isCorrect ? 1 : 0));
    return qId;
  });
  return run();
}

export function deleteQuestion(questionId: number) {
  db.prepare("DELETE FROM question_answers WHERE question_id = ?").run(questionId);
  return db.prepare("DELETE FROM questions WHERE id = ?").run(questionId);
}

export function countBySubjectAndLevel(subjectId: number, module?: number) {
  let sql = "SELECT module, level, COUNT(*) as count FROM questions WHERE subject_id = ?";
  const params: (number | undefined)[] = [subjectId];
  if (module != null) {
    sql += " AND module = ?";
    params.push(module);
  }
  sql += " GROUP BY module, level";
  return db.query(sql).all(...params) as { module: number; level: number; count: number }[];
}
