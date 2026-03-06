/**
 * Đăng nhập / kiểm tra thông tin theo SBD (mota.md).
 * Trả về examSheetId và thông tin đề thi (question_ids) khi kỳ thi active.
 */

import { db } from "../db/index.js";
import { getSheetIdByStudentAndExam } from "../services/sheets";
import { getQuestionForExam } from "./questions";

export function loginBySbd(examId: number, sbd: string) {
  const student = db.query("SELECT id, exam_id, sbd, full_name, base_score FROM exam_students WHERE exam_id = ? AND sbd = ?").get(examId, sbd) as any;
  if (!student) return { ok: false, error: "INVALID_SBD" };
  const exam = db.query("SELECT id, status, duration_minutes, started_at FROM exams WHERE id = ?").get(examId) as any;
  if (!exam) return { ok: false, error: "EXAM_NOT_FOUND" };
  const sheetId = getSheetIdByStudentAndExam(examId, student.id);
  if (!sheetId) return { ok: false, error: "SHEET_NOT_GENERATED" };
  return {
    ok: true,
    studentId: student.id,
    sbd: student.sbd,
    fullName: student.full_name,
    examSheetId: sheetId,
    examStatus: exam.status,
    durationMinutes: exam.duration_minutes,
    startedAt: exam.started_at,
  };
}

/** Client gọi để lấy nội dung 1 câu (chỉ text + đáp án, không có is_correct). */
export function getQuestionForExamApi(questionId: number, examSheetId: number, studentId: number) {
  const sheet = db.query("SELECT id, student_id FROM exam_sheets WHERE id = ? AND student_id = ?").get(examSheetId, studentId) as any;
  if (!sheet) return null;
  const qIds = db.query("SELECT question_ids FROM exam_sheets WHERE id = ?").get(examSheetId) as { question_ids: string };
  const ids = JSON.parse(qIds.question_ids) as number[];
  if (!ids.includes(questionId)) return null;
  return getQuestionForExam(questionId);
}
