/**
 * Heart-beat API (Polling) - mota.md.
 * 1) Sync trạng thái: máy sống, số câu đã làm.
 * 2) Đồng bộ lệnh: Bắt đầu thi / Thu bài, đồng hồ.
 * 3) Gom đáp án: batch gửi lên backup.
 */

import { db } from "../db/index.js";

export type HeartbeatPayload = {
  examSheetId: number;
  questionsAnswered?: number;
  answers?: { questionId: number; selectedIndex: number }[];
};

export function heartbeat(data: HeartbeatPayload) {
  const now = new Date().toISOString();
  const sheet = db.query("SELECT id, exam_id, student_id FROM exam_sheets WHERE id = ?").get(data.examSheetId) as any;
  if (!sheet) return { ok: false, error: "INVALID_SHEET" };

  // Cập nhật last seen + số câu đã làm (cho dashboard giám sát)
  db.prepare(`
    INSERT INTO student_heartbeat (exam_sheet_id, last_seen_at, questions_answered, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(exam_sheet_id) DO UPDATE SET
      last_seen_at = excluded.last_seen_at,
      questions_answered = excluded.questions_answered,
      updated_at = excluded.updated_at
  `).run(
    data.examSheetId,
    now,
    data.questionsAnswered ?? 0
  );

  // Batch lưu đáp án (backup)
  if (data.answers?.length) {
    const upsert = db.prepare(`
      INSERT INTO student_answer_log (exam_sheet_id, question_id, selected_index, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(exam_sheet_id, question_id) DO UPDATE SET selected_index = excluded.selected_index, updated_at = excluded.updated_at
    `);
    for (const a of data.answers) {
      upsert.run(data.examSheetId, a.questionId, a.selectedIndex, now);
    }
  }

  const exam = db.query("SELECT id, status, duration_minutes, started_at FROM exams WHERE id = ?").get(sheet.exam_id) as any;
  const serverTime = now;

  return {
    ok: true,
    serverTime,
    examStatus: exam?.status ?? "draft",
    durationMinutes: exam?.duration_minutes ?? 0,
    examStartedAt: exam?.started_at ?? null,
  };
}

/** Lấy trạng thái kỳ thi (cho Client poll: đã bắt đầu chưa, thời gian còn lại). */
export function getExamState(examId: number) {
  const exam = db.query("SELECT id, status, duration_minutes, started_at FROM exams WHERE id = ?").get(examId) as any;
  if (!exam) return null;
  return {
    examId: exam.id,
    status: exam.status,
    durationMinutes: exam.duration_minutes,
    startedAt: exam.started_at,
    serverTime: new Date().toISOString(),
  };
}

/** Dashboard giám sát: danh sách thí sinh với trạng thái (đang làm, mất kết nối, tiến độ). */
export function getRoomMonitor(examId: number, roomId?: number) {
  let sql = `
    SELECT es.id as sheet_id, st.sbd, st.full_name, h.last_seen_at, h.questions_answered, h.updated_at
    FROM exam_sheets es
    JOIN exam_students st ON st.id = es.student_id
    LEFT JOIN student_heartbeat h ON h.exam_sheet_id = es.id
    WHERE es.exam_id = ?
  `;
  const params: (number | undefined)[] = [examId];
  if (roomId != null) {
    sql += " AND st.room_id = ?";
    params.push(roomId);
  }
  sql += " ORDER BY st.sbd";
  const rows = db.query(sql).all(...params) as any[];
  const now = Date.now();
  const STALE_MS = 30_000; // 30s không heartbeat = mất kết nối
  return rows.map((r) => ({
    sheetId: r.sheet_id,
    sbd: r.sbd,
    fullName: r.full_name,
    lastSeenAt: r.last_seen_at,
    questionsAnswered: r.questions_answered ?? 0,
    status: r.last_seen_at && (now - new Date(r.last_seen_at).getTime() < STALE_MS) ? "online" : "offline",
  }));
}
