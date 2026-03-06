#!/usr/bin/env bun
/**
 * Seed: nhập ngân hàng đề từ thư mục question-bank.
 * Cấu trúc: 6 module (1–6), mỗi module 3 cấp độ (1.1, 1.2, 1.3 … 6.3).
 * Môn thi: Ứng dụng công nghệ thông tin cơ bản (UDCNTTCB).
 */
import { join } from "path";
import { existsSync } from "fs";
import { db } from "./index.ts";
import { importFromBankFolder } from "../services/importBank";

const SUBJECT_NAME = "Ứng dụng công nghệ thông tin cơ bản";
const SUBJECT_CODE = "UDCNTTCB";
const bankPath = process.env.QUESTION_BANK_PATH ?? join(process.cwd(), "..", "question-bank");

if (existsSync(bankPath)) {
  const result = await importFromBankFolder(bankPath, {
    subjectName: SUBJECT_NAME,
    subjectCode: SUBJECT_CODE,
    clearExisting: true,
  });
  console.log("Seed:", result);
  if (result.cleared != null) console.log(`Đã xóa ${result.cleared} câu hỏi cũ.`);
  console.log(`Môn: ${result.subjectName} (${result.subjectCode}), ${result.modules.length} module, ${result.imported} câu hỏi đã nhập.`);
} else {
  console.log("Không tìm thấy thư mục question-bank tại:", bankPath);
}
db.close();
