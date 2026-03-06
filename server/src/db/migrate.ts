#!/usr/bin/env bun
/**
 * Chạy migration: tạo bảng và index.
 * Có thể mở rộng versioned migrations sau.
 */
import { db } from "./index";

console.log("Migration done. Tables and indexes created.");
db.close();
