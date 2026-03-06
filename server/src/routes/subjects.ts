import { db } from "../db/index.js";

export function listSubjects() {
  return db.query("SELECT id, name, code, created_at FROM subjects ORDER BY id").all();
}

export function createSubject(name: string, code?: string) {
  const stmt = db.prepare("INSERT INTO subjects (name, code) VALUES (?, ?)");
  const r = stmt.run(name, code ?? null);
  return { id: r.lastInsertRowid, name, code };
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
