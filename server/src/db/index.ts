import { Database } from "bun:sqlite";
import { SQL, INDEXES } from "./schema";
import { mkdirSync } from "fs";
import { dirname } from "path";

const dbPath = process.env.DATABASE_PATH ?? "./data/quiz.db";
try {
  mkdirSync(dirname(dbPath), { recursive: true });
} catch (_) { }
export const db = new Database(dbPath, { create: true });

function migrate() {
  const tables = [
    "subjects",
    "subject_categories",
    "subject_levels",
    "questions",
    "question_answers",
    "exams",
    "exam_rooms",
    "exam_students",
    "exam_sheets",
    "student_answer_log",
    "exam_results",
    "student_heartbeat",
    "system_config",
  ] as const;
  for (const name of tables) {
    const sql = (SQL as Record<string, string>)[name];
    if (sql) db.run(sql);
  }
  for (const idx of INDEXES) db.run(idx);
  try {
    db.run("ALTER TABLE questions ADD COLUMN module INTEGER NOT NULL DEFAULT 1");
  } catch (_) { }
  try {
    db.run("CREATE INDEX IF NOT EXISTS idx_questions_subject_module_level ON questions(subject_id, module, level)");
  } catch (_) { }
  try {
    db.run("ALTER TABLE subject_categories ADD COLUMN parent_id INTEGER REFERENCES subject_categories(id)");
  } catch (_) { }
  try {
    db.run("ALTER TABLE exams ADD COLUMN code TEXT UNIQUE");
  } catch (_) { }
  try {
    db.run("ALTER TABLE questions ADD COLUMN category_id INTEGER REFERENCES subject_categories(id)");
  } catch (_) { }
  // Backfill question.category_id từ module (lấy category có cùng subject_id và sort_order = module, min id)
  try {
    db.run(`
      UPDATE questions SET category_id = (
        SELECT id FROM subject_categories c
        WHERE c.subject_id = questions.subject_id AND c.sort_order = questions.module
        ORDER BY c.id LIMIT 1
      ) WHERE category_id IS NULL
    `);
  } catch (_) { }
  // Seed default categories (Module 1-6, không cha) và cấp độ (Dễ, Trung bình, Khó) cho môn chưa có
  const subjectIds = db.query("SELECT id FROM subjects").all() as { id: number }[];
  const defaultCategories = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Module 6"];
  const defaultLevels = ["Dễ", "Trung bình", "Khó"];
  const hasCategories = db.prepare("SELECT 1 FROM subject_categories WHERE subject_id = ? LIMIT 1");
  const hasLevels = db.prepare("SELECT 1 FROM subject_levels WHERE subject_id = ? LIMIT 1");
  const insCat = db.prepare("INSERT INTO subject_categories (subject_id, parent_id, name, sort_order) VALUES (?, NULL, ?, ?)");
  const insLev = db.prepare("INSERT INTO subject_levels (subject_id, name, sort_order) VALUES (?, ?, ?)");
  for (const { id: sid } of subjectIds) {
    if (!hasCategories.get(sid)) defaultCategories.forEach((name, i) => insCat.run(sid, name, i + 1));
    if (!hasLevels.get(sid)) defaultLevels.forEach((name, i) => insLev.run(sid, name, i + 1));
  }
}

migrate();

/** Tạo mặc định 6 category (Module 1-6, không cha) và 3 cấp độ (Dễ, Trung bình, Khó) cho môn học mới. */
export function seedSubjectCategoriesAndLevels(subjectId: number) {
  const defaultCategories = ["Module 1", "Module 2", "Module 3", "Module 4", "Module 5", "Module 6"];
  const defaultLevels = ["Dễ", "Trung bình", "Khó"];
  const insCat = db.prepare("INSERT INTO subject_categories (subject_id, parent_id, name, sort_order) VALUES (?, NULL, ?, ?)");
  const insLev = db.prepare("INSERT INTO subject_levels (subject_id, name, sort_order) VALUES (?, ?, ?)");
  defaultCategories.forEach((name, i) => insCat.run(subjectId, name, i + 1));
  defaultLevels.forEach((name, i) => insLev.run(subjectId, name, i + 1));
}

export default db;
