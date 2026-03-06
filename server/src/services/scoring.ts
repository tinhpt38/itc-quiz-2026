/**
 * Chấm điểm chỉ trên Server - mota.md.
 * Nếu điểm thực tế < điểm cơ sở: thuật toán ngẫu nhiên đổi một số đáp án sai thành đúng
 * cho đến khi đạt điểm cơ sở. Xử lý ẩn hoàn toàn.
 */

import { db } from "../db/index.js";

function getCorrectIndex(questionId: number): number {
  const row = db.query("SELECT sort_order FROM question_answers WHERE question_id = ? AND is_correct = 1 LIMIT 1").get(questionId) as { sort_order: number } | undefined;
  return row?.sort_order ?? -1;
}

function getTotalScore(questionIds: number[]): number {
  let total = 0;
  for (const qid of questionIds) {
    const w = db.query("SELECT score_weight FROM questions WHERE id = ?").get(qid) as { score_weight: number } | undefined;
    total += w?.score_weight ?? 1;
  }
  return total;
}

/** Tính điểm thô từ answer_log so với đáp án đúng. */
function computeRawScore(examSheetId: number): { rawScore: number; totalScore: number; details: { questionId: number; correct: boolean }[] } {
  const sheet = db.query("SELECT question_ids FROM exam_sheets WHERE id = ?").get(examSheetId) as { question_ids: string } | undefined;
  if (!sheet) throw new Error("Sheet not found");
  const qIds = JSON.parse(sheet.question_ids) as number[];
  const totalScore = getTotalScore(qIds);
  const log = db.query("SELECT question_id, selected_index FROM student_answer_log WHERE exam_sheet_id = ?").all(examSheetId) as { question_id: number; selected_index: number }[];
  const logMap = new Map(log.map((r) => [r.question_id, r.selected_index]));
  const details: { questionId: number; correct: boolean }[] = [];
  let earned = 0;
  for (const qid of qIds) {
    const correctIndex = getCorrectIndex(qid);
    const selected = logMap.get(qid);
    const correct = selected !== undefined && selected === correctIndex;
    details.push({ questionId: qid, correct });
    const w = db.query("SELECT score_weight FROM questions WHERE id = ?").get(qid) as { score_weight: number } | undefined;
    if (correct) earned += w?.score_weight ?? 1;
  }
  return { rawScore: earned, totalScore, details };
}

/**
 * Điều chỉnh điểm: nếu rawScore < baseScore, "đổi" ngẫu nhiên một số câu sai thành đúng
 * cho đến khi điểm đạt baseScore (ẩn, không lưu chi tiết đổi câu nào).
 */
function adjustToBaseScore(
  rawScore: number,
  totalScore: number,
  baseScore: number | null,
  details: { questionId: number; correct: boolean }[]
): number {
  if (baseScore == null || baseScore <= rawScore) return rawScore;
  const maxPossible = totalScore;
  const target = Math.min(baseScore, maxPossible);
  const wrongIndices = details.map((d, i) => (d.correct ? -1 : i)).filter((i) => i >= 0);
  let current = rawScore;
  const weightPerQuestion = totalScore / details.length;
  const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
  for (const idx of shuffled) {
    if (current >= target) break;
    current += weightPerQuestion;
  }
  return Math.min(current, maxPossible);
}

export function finalizeSheet(examSheetId: number): { rawScore: number; adjustedScore: number } {
  const sheet = db.query("SELECT id, student_id, exam_id FROM exam_sheets WHERE id = ?").get(examSheetId) as any;
  if (!sheet) throw new Error("Sheet not found");
  const existing = db.query("SELECT id FROM exam_results WHERE exam_sheet_id = ?").get(examSheetId);
  if (existing) throw new Error("Already finalized");

  const student = db.query("SELECT base_score FROM exam_students WHERE id = ?").get(sheet.student_id) as { base_score: number | null };
  const baseScore = student?.base_score ?? null;
  const { rawScore, totalScore, details } = computeRawScore(examSheetId);
  const adjustedScore = adjustToBaseScore(rawScore, totalScore, baseScore, details);

  db.prepare("INSERT INTO exam_results (exam_sheet_id, raw_score, adjusted_score) VALUES (?, ?, ?)").run(examSheetId, rawScore, adjustedScore);
  return { rawScore, adjustedScore };
}

export function finalizeAllSheetsForExam(examId: number): { done: number; failed: number } {
  const sheets = db.query("SELECT id FROM exam_sheets WHERE exam_id = ?").all(examId) as { id: number }[];
  let done = 0;
  let failed = 0;
  for (const s of sheets) {
    try {
      finalizeSheet(s.id);
      done++;
    } catch {
      failed++;
    }
  }
  return { done, failed };
}

/** Trả về kết quả đã final cho thí sinh (số câu đúng, điểm) - không tiết lộ raw vs adjusted. */
export function getResultForStudent(examSheetId: number, studentId: number) {
  const sheet = db.query("SELECT student_id FROM exam_sheets WHERE id = ?").get(examSheetId) as { student_id: number } | undefined;
  if (!sheet || sheet.student_id !== studentId) return null;
  const res = db.query("SELECT raw_score, adjusted_score FROM exam_results WHERE exam_sheet_id = ?").get(examSheetId) as { raw_score: number; adjusted_score: number } | undefined;
  if (!res) return null;
  const qIds = db.query("SELECT question_ids FROM exam_sheets WHERE id = ?").get(examSheetId) as { question_ids: string };
  const total = (JSON.parse(qIds.question_ids) as number[]).length;
  return {
    totalQuestions: total,
    score: res.adjusted_score,
    totalScore: total, // có thể tính từ sum(score_weight) nếu cần
  };
}
