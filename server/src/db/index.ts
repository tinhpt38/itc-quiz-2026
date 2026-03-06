import { Database } from "bun:sqlite";
import { SQL, INDEXES } from "./schema";
import { mkdirSync } from "fs";
import { dirname } from "path";

const dbPath = process.env.DATABASE_PATH ?? "./data/quiz.db";
try {
  mkdirSync(dirname(dbPath), { recursive: true });
} catch (_) {}
export const db = new Database(dbPath, { create: true });

function migrate() {
  const tables = [
    "subjects",
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
  } catch (_) {}
  try {
    db.run("CREATE INDEX IF NOT EXISTS idx_questions_subject_module_level ON questions(subject_id, module, level)");
  } catch (_) {}
}

migrate();

export default db;
