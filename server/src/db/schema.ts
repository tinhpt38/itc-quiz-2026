/**
 * Schema SQLite cho ứng dụng thi trắc nghiệm (mota.md).
 * Dùng bun:sqlite, không gửi đáp án đúng xuống Client.
 */

export const SQL = {
  subjects: `
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  questions: `
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      module INTEGER NOT NULL DEFAULT 1 CHECK(module IN (1,2,3,4,5,6)),
      text TEXT NOT NULL,
      level INTEGER NOT NULL CHECK(level IN (1,2,3)),
      score_weight REAL DEFAULT 1.0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  question_answers: `
    CREATE TABLE IF NOT EXISTS question_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL REFERENCES questions(id),
      text TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_correct INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  exams: `
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id),
      name TEXT NOT NULL,
      started_at TEXT,
      ended_at TEXT,
      duration_minutes INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','ended')),
      level_config TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  exam_rooms: `
    CREATE TABLE IF NOT EXISTS exam_rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `,
  exam_students: `
    CREATE TABLE IF NOT EXISTS exam_students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      room_id INTEGER REFERENCES exam_rooms(id),
      sbd TEXT NOT NULL,
      full_name TEXT,
      base_score REAL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(exam_id, sbd)
    );
  `,
  exam_sheets: `
    CREATE TABLE IF NOT EXISTS exam_sheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL REFERENCES exams(id),
      student_id INTEGER NOT NULL REFERENCES exam_students(id),
      question_ids TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(exam_id, student_id)
    );
  `,
  student_answer_log: `
    CREATE TABLE IF NOT EXISTS student_answer_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_sheet_id INTEGER NOT NULL REFERENCES exam_sheets(id),
      question_id INTEGER NOT NULL REFERENCES questions(id),
      selected_index INTEGER NOT NULL,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(exam_sheet_id, question_id)
    );
  `,
  exam_results: `
    CREATE TABLE IF NOT EXISTS exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_sheet_id INTEGER NOT NULL REFERENCES exam_sheets(id) UNIQUE,
      raw_score REAL NOT NULL,
      adjusted_score REAL NOT NULL,
      finalized_at TEXT DEFAULT (datetime('now'))
    );
  `,
  student_heartbeat: `
    CREATE TABLE IF NOT EXISTS student_heartbeat (
      exam_sheet_id INTEGER PRIMARY KEY REFERENCES exam_sheets(id),
      last_seen_at TEXT NOT NULL,
      questions_answered INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `,
  system_config: `
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `,
};

export const INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_questions_subject_level ON questions(subject_id, level);`,
  `CREATE INDEX IF NOT EXISTS idx_questions_subject_module_level ON questions(subject_id, module, level);`,
  `CREATE INDEX IF NOT EXISTS idx_exam_students_exam_sbd ON exam_students(exam_id, sbd);`,
  `CREATE INDEX IF NOT EXISTS idx_exam_sheets_exam ON exam_sheets(exam_id);`,
  `CREATE INDEX IF NOT EXISTS idx_student_answer_log_sheet ON student_answer_log(exam_sheet_id);`,
];
