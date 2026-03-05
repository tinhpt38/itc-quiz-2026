# TRUNG TÂM CÔNG NGHỆ THÔNG TIN - TRƯỜNG ĐẠI HỌC ĐÀ LẠT
## ỨNG DỤNG THI TRẮC NGHIỆM

### 1. Desktop App Server (Giám thị / Quản trị)
- **Quản lý ngân hàng đề thi:** Đề thi có thể được chia thành level.
    - Quản lý môn thi.
    - Quản lý câu hỏi.
    - Quản lý đáp án.
    - *Bổ sung:* Import/Export ngân hàng câu hỏi từ file Excel/Word/AIKEN để tiện lợi nhập liệu.
- **Quản lý kỳ thi:** Một kì thi có nhiều phòng thi, nhiều thí sinh. Đề được phát ngẫu nhiên theo công thức trong ngân hàng đề, cho phép cấu hình theo level bao nhiêu % câu hỏi. Mỗi thí sinh có 1 mã SBD riêng. Cho phép tạo đề thi với danh sách có trước, cho phép chỉnh sửa danh sách, ngày giờ, thông tin kì thi.
    - *Dashboard giám sát phòng thi:* Hiển thị trực quan tình trạng máy thí sinh (đang làm bài, mất kết nối, tiến độ làm bài).
    
    - **Quản lý thí sinh & Điểm cơ sở:** Cho phép cài đặt điểm cơ sở của thí sinh. 
        - *Giải pháp an toàn bảo mật:* Client sẽ không bao giờ nhận "bộ đề có kết quả đúng" (để tránh bị tool bắt gói tin mạng hack đáp án). Thí sinh thi bằng thực lực, khi hết giờ / nộp bài, Server sẽ tự tính điểm. Nếu điểm thực tế >= điểm cơ sở, giữ nguyên. Nếu thấp hơn, Server tự động chạy thuật toán ngẫu nhiên đổi các đáp án sai thành đúng cho đến khi đạt chuẩn mức điểm cơ sở. Quá trình xử lý ẩn hoàn toàn trên Server, thí sinh và giám thị không hề nhận ra.
    - **Quản lý kết quả thi:** Xuất toàn bộ kết quả ra file Excel, mỗi kết quả ra file PDF, cho preview kết quả của thí sinh. Các package xuất file chạy cục bộ offline.
- **Quản lý cấu hình hệ thống.**
- **Quản lý báo cáo & Giám sát:** 
    - Báo cáo phân tích: câu hỏi được ra nhiều nhất, tỉ lệ câu hỏi khó/dễ (dựa trên tỉ lệ làm sai), phổ điểm kỳ thi.


### 2. Desktop App Client (Thí sinh)
- **Cấu hình kết nối qua file `.env`:** 
    - Để đồng nhất và quản lý dễ dàng, cấu hình địa chỉ IP truy cập và Port của Server/Client sẽ được khai báo bên trong một file `.env` của dự án.
    - *Thời điểm Development (Dev):* App chạy tự động đọc `.env` theo môi trường local.
    - *Thời điểm Build Production:* Người quản trị chỉ cần mở file `.env` sửa đúng địa chỉ IP và Port của Server phòng thi đó, rồi tiến hành chạy lệnh Build. Những thông số này sẽ tự động được "đóng gói" cứng (bake-in) vào bên trong file `.exe` của Client.
    - Nhờ vậy, kỹ thuật viên chỉ việc mang duy nhất 1 file `.exe` vừa build này đi copy thả vào hàng trăm máy tính yếu, các máy tính sẽ tự động trỏ hoàn hảo về Server mà không cần cài đặt kết nối phức tạp, cũng như hạn chế tối đa các lỗi chặn mạng từ Router.
- Đăng nhập theo SBD.
- Kiểm tra thông tin theo SBD.
- **Thi trắc nghiệm:**
    - Giám thị chủ động bật/ngưng kì thi. Chỉ khi bật, Client mới hiện đề và cho phép làm bài.
    - **Lưu trạng thái an toàn:**
        - App Client đếm thời gian theo dữ liệu từ Server.
        - Khi thí sinh chọn đáp án, lưu lại ngay lập tức xuống **bộ nhớ cục bộ (localStorage/IndexedDB)** của máy tính đó để phòng sự cố (cúp điện, app tắt đột ngột, hỏng máy).
        - *Phục hồi:* Khi máy mở lại, lúc đăng nhập, hệ thống sẽ kiểm tra thời gian thi còn lại. Ưu tiên lấy bản lưu tạm mới nhất dưới máy con kết hợp dữ liệu đồng bộ trên Server để phục hồi tiến trình bài thi.
    - **Chế độ Kiosk / Anti-cheat:** Khóa toàn màn hình, vô hiệu hóa các phím chuyển cửa sổ (Alt+Tab, Windows), không cho mở tài liệu khác.
    - **UI Bảng điều hướng câu hỏi:** Hiển thị danh sách câu, đánh dấu màu nổi bật câu chưa làm, câu đã làm, tính năng "đánh dấu xem lại". Cảnh báo nổi bật khi sắp hết giờ.
- **Hiển thị kết quả thi:** Hiển thị thông tin thí sinh, câu làm đúng/tổng, số điểm/tổng điểm.

### 3. Giải pháp Kiến trúc & Kỹ Thuật (Tối ưu cho hàng trăm máy yếu)
Vì hệ thống có hàng trăm thí sinh thi đồng thời và đa số dùng máy tính cấu hình có thể không cao, việc giảm tải đường truyền và RAM là rất quan trọng:
- **Cơ chế Giao tiếp mạng: Dùng Heart-beat API (Polling) thay cho WebSocket:**
    - Dùng WebSocket cho hàng trăm/ngàn máy giữ connection liên tục sẽ gây áp lực rất lớn lên Router cấp phát và bộ nhớ Server.
    - **Giải pháp Heart-beat:** Client sẽ dùng các request HTTP ngắn gửi theo chu kỳ (vd: mỗi 5-10 giây một lần).
        1. **Sync Trạng thái:** Gửi gói tin rất nhỏ (báo cáo Server rằng máy đang "sống", và số câu đã làm). Phục vụ cho màn hình Giám sát của Giám thị.
        2. **Đồng bộ Lệnh:** Check xem Giám thị đã bấm "Bắt đầu thi" hay "Thu bài" chưa, check lại đồng hồ đếm ngược cho chuẩn.
        3. **Gom dữ liệu (Batching):** Khi sinh viên làm bài, nhấp chọn đáp án chỉ lưu Offline liên tục. Đến nhịp Heart-beat 10 giây mới gom 1 lượt các thay đổi bóp nhẹ (Payload cực nhỏ) gửi lên Server để backup. Rất tiết kiệm băng thông.
- **Tối ưu Cơ sở dữ liệu & Load dữ liệu:**
    - Sử dụng **SQLite (`bun:sqlite`)**, vô cùng nhẹ, đọc ghi nhanh và không cần cài server phần mềm cồng kềnh, dễ dàng copy/backup trọn vẹn CSDL.
    - Máy Client load nội dung đề thi chỉ một lần đầu tiên khi bắt đầu (nếu đề có hình ảnh, tự cache lưu vào ổ cứng máy con), lúc thí sinh chuyển câu hỏi chỉ render lại UI, tuyệt đối không tải lại data.
- **Công nghệ xây dựng:** 
    - `https://github.com/blackboardsh/electrobun` (Sử dụng hệ thống native Webview siêu nhẹ thông qua Zig/Bun, không ngốn RAM như Electron/Chromium thông thường, rất hợp cho máy yếu).
- **Môi trường dev:** MacOS 
- **Môi trường production:** Windows 10 (chỉ kết nối địa chỉ IP nội bộ, mạng LAN offline, không internet). Quá trình deploy sẽ cross-compile bản nhị phân .exe để phân phát.
