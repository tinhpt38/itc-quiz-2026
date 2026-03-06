import { db, seedSubjectCategoriesAndLevels } from "../db/index.js";

export function listSubjects() {
  return db.query("SELECT id, name, code, created_at FROM subjects ORDER BY id").all();
}

export function createSubject(name: string, code?: string) {
  const stmt = db.prepare("INSERT INTO subjects (name, code) VALUES (?, ?)");
  const r = stmt.run(name, code ?? null);
  const id = r.lastInsertRowid as number;
  seedSubjectCategoriesAndLevels(id);
  return { id, name, code };
}

export function getSubject(id: number) {
  return db.query("SELECT id, name, code, created_at FROM subjects WHERE id = ?").get(id);
}

export function updateSubject(id: number, name: string, code?: string) {
  db.prepare("UPDATE subjects SET name = ?, code = ? WHERE id = ?").run(name, code ?? null, id);
  return getSubject(id);
}

export function deleteSubject(id: number) {
  return db.prepare("DELETE FROM subjects WHERE id = ?").run(id);
}

/** Số câu hỏi thuộc môn (để cảnh báo trước khi xóa môn). */
export function countQuestionsBySubject(subjectId: number): number {
  const r = db.query("SELECT COUNT(*) AS n FROM questions WHERE subject_id = ?").get(subjectId) as { n: number };
  return Number(r?.n ?? 0);
}

/** Số câu hỏi đang dùng category này (để cảnh báo trước khi xóa category). */
export function countQuestionsByCategory(categoryId: number): number {
  const r = db.query("SELECT COUNT(*) AS n FROM questions WHERE category_id = ?").get(categoryId) as { n: number };
  return Number(r?.n ?? 0);
}

/** Số câu hỏi đang dùng cấp độ này (level_id thuộc subject, questions lưu level = sort_order). */
export function countQuestionsByLevel(levelId: number): number {
  const row = db.query("SELECT subject_id, sort_order FROM subject_levels WHERE id = ?").get(levelId) as { subject_id: number; sort_order: number } | undefined;
  if (!row) return 0;
  const r = db.query("SELECT COUNT(*) AS n FROM questions WHERE subject_id = ? AND level = ?").get(row.subject_id, row.sort_order) as { n: number };
  return Number(r?.n ?? 0);
}

// Categories (theo môn học, có cấp cha/con)
export function listCategories(subjectId: number) {
  return db.query(
    "SELECT id, subject_id, parent_id, name, sort_order FROM subject_categories WHERE subject_id = ? ORDER BY (CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END), parent_id, sort_order"
  ).all(subjectId);
}

export function createCategory(subjectId: number, name: string, opts?: { sortOrder?: number; parent_id?: number | null }) {
  const parentId = opts?.parent_id ?? null;
  let next = 1;
  if (parentId == null) {
    const r = db.query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM subject_categories WHERE subject_id = ? AND parent_id IS NULL").get(subjectId) as { n: number };
    next = r?.n ?? 1;
  } else {
    const r = db.query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM subject_categories WHERE subject_id = ? AND parent_id = ?").get(subjectId, parentId) as { n: number };
    next = r?.n ?? 1;
  }
  const sortOrder = opts?.sortOrder ?? next;
  const run = db.prepare("INSERT INTO subject_categories (subject_id, parent_id, name, sort_order) VALUES (?, ?, ?, ?)").run(subjectId, parentId, name, sortOrder);
  return db.query("SELECT id, subject_id, parent_id, name, sort_order FROM subject_categories WHERE id = ?").get(run.lastInsertRowid);
}

export function updateCategory(categoryId: number, name: string, opts?: { sortOrder?: number; parent_id?: number | null }) {
  const row = db.query("SELECT subject_id FROM subject_categories WHERE id = ?").get(categoryId) as { subject_id: number } | undefined;
  if (!row) return null;
  if (opts?.sortOrder != null || opts?.parent_id !== undefined) {
    const parentId = opts.parent_id !== undefined ? opts.parent_id : (db.query("SELECT parent_id FROM subject_categories WHERE id = ?").get(categoryId) as any)?.parent_id ?? null;
    const sortOrder = opts.sortOrder ?? (db.query("SELECT sort_order FROM subject_categories WHERE id = ?").get(categoryId) as any)?.sort_order ?? 1;
    db.prepare("UPDATE subject_categories SET name = ?, sort_order = ?, parent_id = ? WHERE id = ?").run(name, sortOrder, parentId, categoryId);
  } else {
    db.prepare("UPDATE subject_categories SET name = ? WHERE id = ?").run(name, categoryId);
  }
  return db.query("SELECT id, subject_id, parent_id, name, sort_order FROM subject_categories WHERE id = ?").get(categoryId);
}

/** Xóa đúng 1 category theo id, chỉ khi thuộc môn đó (tránh xóa nhầm). */
export function deleteCategory(subjectId: number, categoryId: number) {
  const r = db.prepare("DELETE FROM subject_categories WHERE id = ? AND subject_id = ?").run(categoryId, subjectId);
  return r;
}

// Levels / Cấp độ (theo môn học – Dễ, TB, Khó, có thể tùy chỉnh)
export function listLevels(subjectId: number) {
  return db.query("SELECT id, subject_id, name, sort_order FROM subject_levels WHERE subject_id = ? ORDER BY sort_order").all(subjectId);
}

export function createLevel(subjectId: number, name: string, sortOrder?: number) {
  const next = (db.query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM subject_levels WHERE subject_id = ?").get(subjectId) as { n: number }).n;
  const r = db.prepare("INSERT INTO subject_levels (subject_id, name, sort_order) VALUES (?, ?, ?)").run(subjectId, name, sortOrder ?? next);
  return db.query("SELECT id, subject_id, name, sort_order FROM subject_levels WHERE id = ?").get(r.lastInsertRowid);
}

export function updateLevel(levelId: number, name: string, sortOrder?: number) {
  if (sortOrder != null) {
    db.prepare("UPDATE subject_levels SET name = ?, sort_order = ? WHERE id = ?").run(name, sortOrder, levelId);
  } else {
    db.prepare("UPDATE subject_levels SET name = ? WHERE id = ?").run(name, levelId);
  }
  return db.query("SELECT id, subject_id, name, sort_order FROM subject_levels WHERE id = ?").get(levelId);
}

export function deleteLevel(levelId: number) {
  return db.prepare("DELETE FROM subject_levels WHERE id = ?").run(levelId);
}
