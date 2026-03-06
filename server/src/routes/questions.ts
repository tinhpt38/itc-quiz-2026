import { db } from "../db/index.js";

/**
 * Client KHÔNG bao giờ nhận is_correct (mota.md).
 * Chỉ dùng cho admin và khi chấm điểm trên server.
 */

export function listQuestions(subjectId: number, opts?: { level_id?: number; category_id?: number; level?: number; module?: number }) {
  let sql = `
    SELECT q.id, q.subject_id, q.module, q.text, q.level, q.score_weight, q.created_at,
           c.id AS category_id, c.name AS category_name,
           l.id AS level_id, l.name AS level_name
    FROM questions q
    LEFT JOIN subject_categories c ON c.id = q.category_id
    LEFT JOIN subject_levels l ON l.subject_id = q.subject_id AND l.sort_order = q.level
    WHERE q.subject_id = ?
  `;
  const params: (number | undefined)[] = [subjectId];
  if (opts?.category_id != null) {
    sql += " AND q.category_id = ?";
    params.push(opts.category_id);
  } else if (opts?.module != null) {
    sql += " AND q.module = ?";
    params.push(opts.module);
  }
  if (opts?.level_id != null) {
    sql += " AND q.level = (SELECT sort_order FROM subject_levels WHERE id = ? AND subject_id = q.subject_id)";
    params.push(opts.level_id);
  } else if (opts?.level != null) {
    sql += " AND q.level = ?";
    params.push(opts.level);
  }
  sql += " ORDER BY q.module, q.level, q.id";
  return db.query(sql).all(...params);
}

/** Trả về câu hỏi + đáp án (chỉ dùng cho Admin, không gửi cho Client thi). Có thêm category_id, level_id, category_name, level_name. */
export function getQuestionWithAnswersAdmin(questionId: number) {
  const q = db.query(`
    SELECT q.id, q.subject_id, q.category_id, q.module, q.text, q.level, q.score_weight,
           c.id AS category_id, c.name AS category_name,
           l.id AS level_id, l.name AS level_name
    FROM questions q
    LEFT JOIN subject_categories c ON c.id = q.category_id
    LEFT JOIN subject_levels l ON l.subject_id = q.subject_id AND l.sort_order = q.level
    WHERE q.id = ?
  `).get(questionId) as any;
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

/** Nếu có category_id/level_id thì dùng sort_order của chúng; không thì dùng module/level (số 1-based). */
export function createQuestion(
  subjectId: number,
  text: string,
  answers: { text: string; isCorrect: boolean }[],
  opts: { level?: number; module?: number; category_id?: number; level_id?: number; scoreWeight?: number } = {}
) {
  let moduleSort = opts.module ?? 1;
  let levelSort = opts.level ?? 1;
  if (opts.category_id != null) {
    const cat = db.query("SELECT sort_order FROM subject_categories WHERE id = ? AND subject_id = ?").get(opts.category_id, subjectId) as { sort_order: number } | undefined;
    if (cat) moduleSort = cat.sort_order;
  }
  if (opts.level_id != null) {
    const lev = db.query("SELECT sort_order FROM subject_levels WHERE id = ? AND subject_id = ?").get(opts.level_id, subjectId) as { sort_order: number } | undefined;
    if (lev) levelSort = lev.sort_order;
  }
  const scoreWeight = opts.scoreWeight ?? 1;

  const categoryId = opts.category_id ?? null;
  const run = db.transaction(() => {
    const r = db.prepare("INSERT INTO questions (subject_id, category_id, module, text, level, score_weight) VALUES (?, ?, ?, ?, ?, ?)").run(subjectId, categoryId, moduleSort, text, levelSort, scoreWeight);
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
