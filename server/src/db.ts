import { Database } from "bun:sqlite";
import path from "path";

const dbPath = process.env.DB_FILE || "./database.sqlite";
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    level TEXT NOT NULL CHECK(level IN ('EASY', 'MEDIUM', 'HARD')),
    content TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON array of options
    correct_answer INTEGER NOT NULL, -- index of correct option
    FOREIGN KEY(subject_id) REFERENCES Subjects(id)
  );

  CREATE TABLE IF NOT EXISTS Exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_time TEXT NOT NULL, -- ISO string
    end_time TEXT NOT NULL, -- ISO string
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACTIVE', 'CLOSED')),
    config TEXT NOT NULL -- JSON storing {easy: %, medium: %, hard: %}
  );

  CREATE TABLE IF NOT EXISTS Rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(exam_id) REFERENCES Exams(id)
  );

  CREATE TABLE IF NOT EXISTS Candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    sbd TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    base_score REAL, -- null if not set
    current_ip TEXT, -- to track active login and prevent duplicate logins
    pc_name TEXT, -- to track which PC they are logging from
    is_online INTEGER DEFAULT 0, -- 1 for true, 0 for false
    last_active TEXT, -- ISO string timestamp of last heartbeat
    collision_pc TEXT, -- to track duplicate login attempts from other PCs
    FOREIGN KEY(room_id) REFERENCES Rooms(id)
  );

  CREATE TABLE IF NOT EXISTS Results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    exam_id INTEGER NOT NULL,
    questions TEXT NOT NULL, -- JSON array of generated question IDs for this candidate
    answers TEXT NOT NULL, -- JSON array of user selected options
    score REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'IN-PROGRESS' CHECK(status IN ('IN-PROGRESS', 'SUBMITTED')),
    FOREIGN KEY(candidate_id) REFERENCES Candidates(id),
    FOREIGN KEY(exam_id) REFERENCES Exams(id)
  );
`);

export default db;
