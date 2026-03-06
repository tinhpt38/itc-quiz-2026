/**
 * Import ngân hàng câu hỏi từ file JSON (format question-bank) hoặc AIKEN.
 */

import { db } from "../db/index.js";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

type JsonQuestion = {
  question: string;
  level: number;
  answer: { text: string; isCorrect: boolean }[];
  score?: number;
};

/** options.module (1-6), options.level (1-3): từ tên thư mục ví dụ "1.1" => module 1, level 1 */
export async function importFromJsonFile(
  filePath: string,
  subjectId: number,
  options?: { module?: number; level?: number }
): Promise<{ imported: number; errors: string[] }> {
  const raw = await readFile(filePath, "utf-8");
  let list: JsonQuestion[];
  try {
    list = JSON.parse(raw);
  } catch {
    return { imported: 0, errors: ["Invalid JSON"] };
  }
  if (!Array.isArray(list)) return { imported: 0, errors: ["Expected JSON array"] };
  const moduleOverride = options?.module != null ? Math.min(6, Math.max(1, options.module)) : null;
  const levelOverride = options?.level != null ? Math.min(3, Math.max(1, options.level)) : null;
  const errors: string[] = [];
  let imported = 0;
  const insQ = db.prepare(
    "INSERT INTO questions (subject_id, module, text, level, score_weight) VALUES (?, ?, ?, ?, ?)"
  );
  const insA = db.prepare("INSERT INTO question_answers (question_id, text, sort_order, is_correct) VALUES (?, ?, ?, ?)");
  for (let i = 0; i < list.length; i++) {
    const q = list[i];
    if (!q.question || !Array.isArray(q.answer)) {
      errors.push(`Row ${i + 1}: missing question or answers`);
      continue;
    }
    const moduleVal = moduleOverride ?? 1;
    const level = levelOverride ?? Math.min(3, Math.max(1, q.level ?? 1));
    const weight = typeof q.score === "number" ? q.score : 1;
    try {
      const r = insQ.run(subjectId, moduleVal, q.question, level, weight);
      const qId = r.lastInsertRowid as number;
      q.answer.forEach((a, j) => insA.run(qId, a.text, j, a.isCorrect ? 1 : 0));
      imported++;
    } catch (e) {
      errors.push(`Row ${i + 1}: ${String(e)}`);
    }
  }
  return { imported, errors };
}

/**
 * Parse tên thư mục dạng "X.Y" (ví dụ 1.1, 2.3) → module X (1-6), level Y (1-3).
 */
function parseModuleLevel(name: string): { module: number; level: number } {
  const m = name.match(/^(\d+)\.(\d+)$/);
  if (m) {
    const module = Math.min(6, Math.max(1, parseInt(m[1], 10)));
    const level = Math.min(3, Math.max(1, parseInt(m[2], 10)));
    return { module, level };
  }
  return { module: 1, level: 1 };
}

/**
 * Import từ thư mục question-bank: 6 module (1-6), mỗi module 3 cấp độ (1.1, 1.2, 1.3, ... 6.3).
 * Tạo 1 môn thi nếu chưa có (theo name hoặc code).
 * clearExisting: nếu true, xóa hết câu hỏi cũ của môn đó trước khi nhập (tránh trùng khi chạy lại).
 */
export async function importFromBankFolder(
  bankPath: string,
  options?: { subjectName?: string; subjectCode?: string; clearExisting?: boolean }
): Promise<{ subjectId: number; subjectName: string; subjectCode: string | null; modules: string[]; imported: number; cleared?: number }> {
  const infoPath = join(bankPath, "info.json");
  let modules: { name: string; level: number }[] = [];
  try {
    const info = JSON.parse(await readFile(infoPath, "utf-8"));
    modules = (info.modules || []).map((m: any) => ({ name: m.name, level: m.level ?? 1 }));
  } catch {
    const dirs = await readdir(bankPath, { withFileTypes: true });
    modules = dirs.filter((d) => d.isDirectory()).map((d) => ({ name: d.name, level: 1 }));
  }
  const subjectName = options?.subjectName ?? "Ngân hàng đề";
  const subjectCode = options?.subjectCode ?? null;
  let existing = subjectCode
    ? (db.query("SELECT id, name, code FROM subjects WHERE code = ? LIMIT 1").get(subjectCode) as { id: number; name: string; code: string | null } | undefined)
    : (db.query("SELECT id, name, code FROM subjects WHERE name = ? LIMIT 1").get(subjectName) as { id: number; name: string; code: string | null } | undefined);
  let subjectId: number;
  let resultCleared = 0;
  if (existing) {
    subjectId = existing.id;
    if (subjectCode && existing.code !== subjectCode) {
      db.prepare("UPDATE subjects SET code = ? WHERE id = ?").run(subjectCode, subjectId);
    }
    if (existing.name !== subjectName) {
      db.prepare("UPDATE subjects SET name = ? WHERE id = ?").run(subjectName, subjectId);
    }
    if (options?.clearExisting) {
      const ids = db.query("SELECT id FROM questions WHERE subject_id = ?").all(subjectId) as { id: number }[];
      for (const { id } of ids) {
        db.prepare("DELETE FROM question_answers WHERE question_id = ?").run(id);
      }
      const del = db.prepare("DELETE FROM questions WHERE subject_id = ?").run(subjectId);
      resultCleared = del.changes;
    }
  } else {
    const r = db.prepare("INSERT INTO subjects (name, code) VALUES (?, ?)").run(subjectName, subjectCode);
    subjectId = r.lastInsertRowid as number;
  }
  let totalImported = 0;
  const done: string[] = [];
  for (const mod of modules) {
    const { module, level } = parseModuleLevel(mod.name);
    const jsonPath = join(bankPath, mod.name, `${mod.name}.json`);
    try {
      const { imported } = await importFromJsonFile(jsonPath, subjectId, { module, level });
      totalImported += imported;
      done.push(mod.name);
    } catch {
      // skip missing files
    }
  }
  return { subjectId, subjectName, subjectCode, modules: done, imported: totalImported, ...(resultCleared ? { cleared: resultCleared } : {}) };
}

/**
 * Parse AIKEN format (A), B), C)... one correct letter, then blank line).
 */
export function parseAikenContent(content: string): JsonQuestion[] {
  const questions: JsonQuestion[] = [];
  const blocks = content.split(/\n\s*\n/).filter((b) => b.trim());
  for (const block of blocks) {
    const lines = block.trim().split("\n").filter(Boolean);
    if (lines.length < 2) continue;
    const question = lines[0].trim();
    const answers: { text: string; isCorrect: boolean }[] = [];
    let correctLetter = "";
    for (let i = 1; i < lines.length; i++) {
      const m = lines[i].match(/^([A-Z])[.)]\s*(.+)$/);
      if (m) {
        answers.push({ text: m[2].trim(), isCorrect: false });
        if (i === lines.length - 1 && m[1].length === 1) correctLetter = m[1];
      }
    }
    const last = lines[lines.length - 1];
    const correctMatch = last.match(/^ANSWER:\s*([A-Z])/i);
    if (correctMatch) {
      correctLetter = correctMatch[1].toUpperCase();
      answers.pop(); // remove ANSWER line from answers if it was parsed as answer
    }
    const letters = "ABCDEFGH";
    answers.forEach((a, i) => {
      a.isCorrect = letters[i] === correctLetter;
    });
    if (answers.length) questions.push({ question, level: 1, answer: answers });
  }
  return questions;
}

export function importAikenToSubject(content: string, subjectId: number, module = 1): { imported: number } {
  const list = parseAikenContent(content);
  const insQ = db.prepare("INSERT INTO questions (subject_id, module, text, level, score_weight) VALUES (?, ?, ?, ?, ?)");
  const insA = db.prepare("INSERT INTO question_answers (question_id, text, sort_order, is_correct) VALUES (?, ?, ?, ?)");
  for (const q of list) {
    const r = insQ.run(subjectId, module, q.question, 1, 1);
    const qId = r.lastInsertRowid as number;
    q.answer.forEach((a, j) => insA.run(qId, a.text, j, a.isCorrect ? 1 : 0));
  }
  return { imported: list.length };
}
