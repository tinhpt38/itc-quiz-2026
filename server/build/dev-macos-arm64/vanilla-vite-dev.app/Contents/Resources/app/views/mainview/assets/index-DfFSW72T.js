(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function x(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(s){if(s.ep)return;s.ep=!0;const l=x(s);fetch(s.href,l)}})();const H=`<div class="relative flex h-screen min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-blue-50 to-background-light dark:from-background-dark dark:to-slate-900">
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-10 py-4 z-10 sticky top-0">
<div class="flex items-center gap-4 text-slate-900 dark:text-slate-100">
<div class="flex items-center justify-center size-8 rounded-lg bg-primary text-white shadow-sm">
<span class="material-symbols-outlined text-xl">admin_panel_settings</span>
</div>
<h2 class="text-lg font-bold leading-tight tracking-tight">Hệ Thống Thi Trực Tuyến</h2>
</div>
<div class="flex items-center gap-4">
<button class="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200">
<span class="material-symbols-outlined text-[20px]">help</span>
                    Trợ giúp
                </button>
</div>
</header>
<div class="flex-1 flex items-center justify-center p-6 sm:p-12">
<div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
<div class="p-8 pb-6 text-center border-b border-slate-100 dark:border-slate-700/50">
<div class="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
<span class="material-symbols-outlined text-3xl">shield_person</span>
</div>
<h1 class="text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white mb-2">Đăng nhập Quản trị</h1>
<p class="text-slate-500 dark:text-slate-400 text-sm font-normal">Cổng đăng nhập an toàn dành cho ban quản trị và giám thị.</p>
</div>
<div class="p-8 flex flex-col gap-6">
<form class="flex flex-col gap-5">
<div class="flex flex-col gap-2">
<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Tên đăng nhập</label>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
<input class="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-primary dark:focus:border-primary h-12 pl-10 pr-4 text-base font-normal leading-normal transition-all" placeholder="Nhập tên đăng nhập" type="text" value=""/>
</div>
</div>
<div class="flex flex-col gap-2">
<div class="flex items-center justify-between">
<label class="text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
<a class="text-sm font-medium text-primary hover:underline" href="#">Quên mật khẩu?</a>
</div>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
<input class="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:border-primary dark:focus:border-primary h-12 pl-10 pr-10 text-base font-normal leading-normal transition-all" placeholder="••••••••" type="password" value=""/>
<button class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none" type="button">
<span class="material-symbols-outlined text-[20px]">visibility_off</span>
</button>
</div>
</div>
<div class="flex items-center gap-2 mt-1">
<input class="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-700 size-4" id="remember" type="checkbox"/>
<label class="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer" for="remember">Ghi nhớ đăng nhập</label>
</div>
<button class="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 active:bg-primary/95 text-white text-base font-bold leading-normal tracking-wide transition-colors shadow-sm shadow-primary/30" type="button">
<span class="material-symbols-outlined mr-2 text-[20px]">login</span>
                            Đăng nhập Hệ thống
                        </button>
</form>
</div>
<div class="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-100 dark:border-slate-700/50">
<p class="text-xs text-slate-500 dark:text-slate-400">
                        Bằng việc đăng nhập, bạn đồng ý với <a class="text-primary hover:underline" href="#">Chính sách bảo mật</a> &amp; <a class="text-primary hover:underline" href="#">Điều khoản</a> của chúng tôi.
                    </p>
</div>
</div>
<div class="hidden lg:flex flex-col ml-16 max-w-md gap-6 items-start">
<div class="w-full bg-slate-200 dark:bg-slate-700 aspect-video rounded-xl shadow-lg bg-cover bg-center" data-alt="Abstract illustration of a secure digital network or centralized database." style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPGsvOrFV9A60fXwP0bwYgdrDFZwdrOd9VdfBpKt0bQEB4xhZojAEvxf1F02UNQzQ2QbfAYllf3wQSol4gNxmm78dDW3lwIg62WGopZibgyuLLaDY-xNP8XXtN2p3iuTi9RZw4IAXKnilu3cREK44nBgSAsoVgKocmahukn4_18AyPmjVQid410ETRRHz6bPJqMfOtI7_OV8th_zqvI7VeUvxwy-2GskzVdRHGaWfOUq4vuYJPwzK6kdnUIqjLLW4fJcfLA09Vfas");'></div>
<div>
<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Hệ Thống Quản Lý Thi Tập Trung</h3>
<p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Cung cấp công cụ mạnh mẽ cho ban quản trị và giám thị để tổ chức, giám sát và đánh giá các kỳ thi một cách minh bạch, an toàn và hiệu quả.
                    </p>
</div>
<div class="flex gap-4">
<div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
<span class="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                         Bảo mật cao
                     </div>
<div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
<span class="material-symbols-outlined text-primary text-[20px]">speed</span>
                         Hiệu suất tối ưu
                     </div>
</div>
</div>
</div>
<footer class="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
            © 2024 Exam System. All rights reserved.
        </footer>
</div>`,N=`<div
    class="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900 w-full rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
    <!-- Header -->
    <header
        class="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 gap-4">
        <div class="flex items-center gap-4">
            <select id="dashboard-exam-select"
                class="form-select rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium shadow-sm w-64 h-10 px-3 cursor-pointer">
                <option value="">Chọn kỳ thi...</option>
            </select>
            <div>
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium" id="dashboard-exam-stats">Sĩ số: 0 |
                    Đang thi: 0 | Ngoại tuyến: 0</p>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <button id="btn-dashboard-start"
                class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hidden transition-colors">
                <span class="material-symbols-outlined mr-2 text-sm">play_arrow</span>Bắt đầu thi
            </button>
            <button id="btn-dashboard-collect"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hidden transition-colors">
                <span class="material-symbols-outlined mr-2 text-sm">stop</span>Thu bài
            </button>
        </div>
    </header>

    <!-- Monitoring Grid -->
    <div class="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
        <div id="candidates-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div class="col-span-full text-center py-8 text-slate-500 font-medium">Vui lòng chọn kỳ thi để xem danh sách
                phòng.</div>
        </div>
    </div>
</div>`,C=`<div class="flex flex-1 overflow-hidden h-full w-full">
    <!-- Left Panel: Question List -->
    <div
        class="flex flex-col w-full lg:w-3/5 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div class="p-6 pb-2">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">Ngân hàng câu hỏi</h1>
                <div class="flex gap-2">
                    <button id="btn-export-questions"
                        class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                        <span class="material-symbols-outlined text-lg">download</span>
                        Export Excel
                    </button>
                    <button id="btn-import-questions"
                        class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                        <span class="material-symbols-outlined text-lg">upload</span>
                        Import Excel
                    </button>
                    <button id="btn-new-question"
                        class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90">
                        <span class="material-symbols-outlined text-lg">add</span>
                        Câu hỏi mới
                    </button>
                </div>
            </div>
            <div class="flex gap-3 flex-wrap mb-4">
                <div class="relative">
                    <select id="filter-subject"
                        class="form-select pl-3 pr-8 py-1.5 text-sm border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 appearance-none focus:ring-primary focus:border-primary">
                        <option value="">Môn: Tất cả</option>
                        <!-- dynamically inserted -->
                    </select>
                    <span
                        class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
                </div>
            </div>
        </div>
        <div class="flex-1 overflow-auto px-6 pb-6 @container">
            <div class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <th class="px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 w-16">ID
                            </th>
                            <th class="px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                                Câu hỏi</th>
                            <th
                                class="px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 w-24 hidden @md:table-cell">
                                Môn / Mức độ</th>
                            <th
                                class="px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 w-16 text-center">
                                Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody id="questions-tbody" class="divide-y divide-slate-200 dark:divide-slate-700">
                        <!-- Dynamic Rows -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- Right Panel: Edit Form -->
    <div class="hidden lg:flex flex-col w-2/5 bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-700 overflow-auto ml-auto"
        id="question-form-panel">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <h2 class="text-lg font-bold flex items-center gap-2" id="form-title">
                <span class="material-symbols-outlined text-primary text-xl">edit_square</span>
                Tạo / Sửa câu hỏi
            </h2>
        </div>
        <form id="question-form" class="flex flex-col flex-1" onsubmit="event.preventDefault();">
            <div class="p-6 flex-1 space-y-6">
                <!-- Form Fields -->
                <div class="space-y-4">
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Môn
                                thi</label>
                            <select id="q-subject"
                                class="form-select w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                                required>
                            </select>
                        </div>
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Độ
                                khó</label>
                            <select id="q-difficulty"
                                class="form-select w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                                required>
                                <option value="EASY">Dễ</option>
                                <option value="MEDIUM">Trung bình</option>
                                <option value="HARD">Khó</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nội dung câu
                            hỏi</label>
                        <textarea id="q-content"
                            class="form-textarea w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                            rows="3" required></textarea>
                    </div>
                    <!-- Options -->
                    <div class="space-y-3 pt-2">
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Các đáp án</label>
                        <div class="flex items-center gap-3">
                            <input class="text-primary focus:ring-primary" name="q_correct_answer" type="radio"
                                value="0" required />
                            <span class="font-bold text-sm text-slate-500 w-6">A.</span>
                            <input
                                class="q-option form-input flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                                type="text" required />
                        </div>
                        <div class="flex items-center gap-3">
                            <input class="text-primary focus:ring-primary" name="q_correct_answer" type="radio"
                                value="1" />
                            <span class="font-bold text-sm text-slate-500 w-6">B.</span>
                            <input
                                class="q-option form-input flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                                type="text" required />
                        </div>
                        <div class="flex items-center gap-3">
                            <input class="text-primary focus:ring-primary" name="q_correct_answer" type="radio"
                                value="2" />
                            <span class="font-bold text-sm text-slate-500 w-6">C.</span>
                            <input
                                class="q-option form-input flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                                type="text" required />
                        </div>
                        <div class="flex items-center gap-3">
                            <input class="text-primary focus:ring-primary" name="q_correct_answer" type="radio"
                                value="3" />
                            <span class="font-bold text-sm text-slate-500 w-6">D.</span>
                            <input
                                class="q-option form-input flex-1 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary dark:text-white"
                                type="text" required />
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-end gap-3 mt-auto">
                <button type="button" id="btn-cancel-edit"
                    class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Hủy</button>
                <button type="submit" id="btn-save-question"
                    class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">Lưu
                    câu hỏi</button>
            </div>
        </form>
    </div>
</div>`,M=`<div class="p-6 md:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6">
    <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold">Quản lý Kỳ Thi</h1>
            <p class="text-slate-500 text-sm">Tạo và cấu hình các kỳ thi</p>
        </div>
        <button id="btn-create-exam"
            class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center shadow-sm">
            <span class="material-symbols-outlined mr-2">add</span>Tạo kỳ thi
        </button>
    </div>

    <!-- Exam List -->
    <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th class="px-6 py-4 text-sm font-medium text-slate-500">ID</th>
                    <th class="px-6 py-4 text-sm font-medium text-slate-500">Kỳ Thi / Cấu hình đề</th>
                    <th class="px-6 py-4 text-sm font-medium text-slate-500">Trạng Thái</th>
                    <th class="px-6 py-4 text-sm font-medium text-slate-500">Hành Động</th>
                </tr>
            </thead>
            <tbody id="exam-list">
                <tr>
                    <td colspan="4" class="text-center py-8 text-slate-500"><span
                            class="material-symbols-outlined animate-spin align-middle mr-2">refresh</span>Đang tải dữ
                        liệu...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Form Create Exam -->
    <div id="exam-form-panel" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div
            class="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">Thêm Kỳ Thi Mới</h2>
                <button id="btn-close-exam-form"
                    class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><span
                        class="material-symbols-outlined">close</span></button>
            </div>
            <form id="exam-form" class="p-6 overflow-y-auto space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Tên Kỳ Thi</label>
                    <input type="text" id="exam-name" required
                        class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
                        placeholder="VD: Thi Giữa Kỳ Toán" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Môn Thi</label>
                    <select id="exam-subject" required
                        class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"></select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Thời gian bắt
                            đầu</label>
                        <input type="datetime-local" id="exam-start" required
                            class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Thời gian kết
                            thúc</label>
                        <input type="datetime-local" id="exam-end" required
                            class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white" />
                    </div>
                </div>
                <div class="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                    <h3 class="text-sm font-bold mb-3 text-slate-900 dark:text-white">Cấu trúc đề thi (Số câu hỏi)</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-green-600 mb-1">Dễ</label>
                            <input type="number" id="exam-easy" min="0" value="10" required
                                class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-center font-medium focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-yellow-600 dark:text-yellow-500 mb-1">Trung
                                Bình</label>
                            <input type="number" id="exam-medium" min="0" value="10" required
                                class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-center font-medium focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:text-white" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-red-600 mb-1">Khó</label>
                            <input type="number" id="exam-hard" min="0" value="5" required
                                class="w-full form-input rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-center font-medium focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:text-white" />
                        </div>
                    </div>
                </div>
            </form>
            <div
                class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button type="button" id="btn-cancel-exam"
                    class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Hủy</button>
                <button type="button" id="btn-save-exam"
                    class="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 shadow-sm transition-colors">Lưu
                    Kỳ Thi</button>
            </div>
        </div>
    </div>
</div>`,$=`<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden">
<div class="layout-container flex h-full grow flex-col">
<div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
<div class="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full">
<!-- Top Navigation Bar -->
<header class="flex flex-col md:flex-row items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-4 md:px-10 py-3 gap-4 md:gap-0">
<div class="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
<div class="flex items-center gap-4 text-slate-900 dark:text-slate-100">
<div class="size-6 text-primary">
<span class="material-symbols-outlined text-2xl">school</span>
</div>
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">Exam System</h2>
</div>
<!-- Search (Mobile hidden, Desktop visible) -->
<label class="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
<div class="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-shadow">
<div class="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-4 bg-transparent">
<span class="material-symbols-outlined text-xl">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-4 pl-2 text-sm font-normal leading-normal" placeholder="Search" value=""/>
</div>
</label>
</div>
<div class="flex flex-1 justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto items-center">
<nav class="flex items-center gap-4 md:gap-9 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal whitespace-nowrap" href="#">Dashboard</a>
<a class="text-primary dark:text-primary text-sm font-medium leading-normal border-b-2 border-primary pb-1 whitespace-nowrap" href="#">Students</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal whitespace-nowrap" href="#">Exams</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal whitespace-nowrap" href="#">Reports</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal whitespace-nowrap" href="#">Settings</a>
</nav>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border border-slate-200 dark:border-slate-700" data-alt="User profile avatar" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbpVyicHjHr-S-w7kuu9gFZAk-IVX2PszwhnXjNJwdpssC3O77WAUSmI3Z7P97eLc9IlcipLShgViWTuFUG5RZ4n5W1RePdIf4bZZxF9GAHqPeVXwsBqtsNyFiDbc51JY9bsmYR-V0C18_nkX0HugWy0eGOxgwXRnl8qZ5ofDe9uARhFc04jM3sHvz5CfXSpXHMPuADW3wqflEN3vN2hhoWLo7tWOVBniKOwFBziFk2F7B_RyPIvO02ZXaKOFn1dm0O7HTtWxBdgg");'></div>
</div>
</header>
<!-- Page Header -->
<div class="flex flex-col md:flex-row flex-wrap justify-between gap-4 p-4 mt-4">
<div class="flex flex-col gap-2">
<h1 class="text-slate-900 dark:text-slate-100 tracking-tight text-2xl md:text-[32px] font-bold leading-tight">Student &amp; Base Score Management</h1>
<p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">Manage student details and update base scores (Điểm cơ sở)</p>
</div>
<div class="flex items-center gap-3">
<button class="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium leading-normal shadow-sm gap-2">
<span class="material-symbols-outlined text-lg">download</span>
<span class="truncate">Export</span>
</button>
<button class="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium leading-normal shadow-sm gap-2">
<span class="material-symbols-outlined text-lg">upload_file</span>
<span class="truncate">Import Student List</span>
</button>
</div>
</div>
<!-- Search and Filters -->
<div class="px-4 py-3 flex flex-col md:flex-row gap-4">
<label class="flex flex-col flex-1 min-w-[240px] h-10 w-full">
<div class="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-shadow">
<div class="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-4 bg-transparent">
<span class="material-symbols-outlined text-xl">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 px-4 pl-2 text-sm font-normal leading-normal" placeholder="Search by ID, Name, or Class" value=""/>
</div>
</label>
<div class="flex gap-3">
<div class="relative w-40">
<select class="w-full h-10 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer">
<option value="">All Classes</option>
<option value="10A1">10A1</option>
<option value="10A2">10A2</option>
<option value="11B1">11B1</option>
<option value="12C3">12C3</option>
</select>
<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
<span class="material-symbols-outlined text-lg">expand_more</span>
</div>
</div>
<div class="relative w-48">
<select class="w-full h-10 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer">
<option value="">All Score Status</option>
<option value="scored">Has Score</option>
<option value="unscored">Needs Score</option>
</select>
<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
<span class="material-symbols-outlined text-lg">expand_more</span>
</div>
</div>
</div>
</div>
<!-- Table -->
<div class="px-4 py-3 @container">
<div class="flex overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
<table class="w-full min-w-[800px] text-left border-collapse">
<thead>
<tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
<th class="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider w-[120px]">
                                            Student ID
                                        </th>
<th class="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                                            Name
                                        </th>
<th class="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider w-[100px]">
                                            Class
                                        </th>
<th class="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider w-[200px]">
                                            Base Score (Điểm cơ sở)
                                        </th>
<th class="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider w-[150px] text-right">
                                            Actions
                                        </th>
</tr>
</thead>
<tbody class="divide-y divide-slate-200 dark:divide-slate-800">
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
<td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm font-medium">STU-001</td>
<td class="px-4 py-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">NV</div>
<span class="text-slate-900 dark:text-slate-100 text-sm font-medium">Nguyen Van A</span>
</div>
</td>
<td class="px-4 py-3">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">10A1</span>
</td>
<td class="px-4 py-3">
<div class="relative w-24">
<input class="w-full h-8 pl-2 pr-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder-slate-400" max="10" min="0" placeholder="e.g. 8.5" step="0.1" type="number"/>
</div>
</td>
<td class="px-4 py-3 text-right">
<button class="text-primary hover:text-primary/80 transition-colors p-1" title="Save Score">
<span class="material-symbols-outlined text-lg">save</span>
</button>
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 ml-2" title="Edit Student">
<span class="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
<td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm font-medium">STU-002</td>
<td class="px-4 py-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">TT</div>
<span class="text-slate-900 dark:text-slate-100 text-sm font-medium">Tran Thi B</span>
</div>
</td>
<td class="px-4 py-3">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">10A2</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center gap-2">
<span class="text-slate-900 dark:text-slate-100 text-sm font-bold">8.5</span>
<span class="material-symbols-outlined text-green-500 text-sm" title="Saved">check_circle</span>
</div>
</td>
<td class="px-4 py-3 text-right">
<button class="text-slate-400 hover:text-primary transition-colors p-1" title="Edit Score">
<span class="material-symbols-outlined text-lg">edit_note</span>
</button>
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 ml-2" title="Edit Student">
<span class="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
<td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm font-medium">STU-003</td>
<td class="px-4 py-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">LV</div>
<span class="text-slate-900 dark:text-slate-100 text-sm font-medium">Le Van C</span>
</div>
</td>
<td class="px-4 py-3">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">11B1</span>
</td>
<td class="px-4 py-3">
<div class="relative w-24">
<input class="w-full h-8 pl-2 pr-2 rounded border border-amber-300 dark:border-amber-600/50 bg-amber-50 dark:bg-amber-900/20 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-primary focus:border-primary placeholder-slate-400" max="10" min="0" placeholder="Missing" step="0.1" type="number"/>
</div>
</td>
<td class="px-4 py-3 text-right">
<button class="text-primary hover:text-primary/80 transition-colors p-1" title="Save Score">
<span class="material-symbols-outlined text-lg">save</span>
</button>
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 ml-2" title="Edit Student">
<span class="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
<td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm font-medium">STU-004</td>
<td class="px-4 py-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">PT</div>
<span class="text-slate-900 dark:text-slate-100 text-sm font-medium">Pham Thi D</span>
</div>
</td>
<td class="px-4 py-3">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">12C3</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center gap-2">
<span class="text-slate-900 dark:text-slate-100 text-sm font-bold">9.0</span>
<span class="material-symbols-outlined text-green-500 text-sm" title="Saved">check_circle</span>
</div>
</td>
<td class="px-4 py-3 text-right">
<button class="text-slate-400 hover:text-primary transition-colors p-1" title="Edit Score">
<span class="material-symbols-outlined text-lg">edit_note</span>
</button>
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 ml-2" title="Edit Student">
<span class="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
<td class="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm font-medium">STU-005</td>
<td class="px-4 py-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">HV</div>
<span class="text-slate-900 dark:text-slate-100 text-sm font-medium">Hoang Van E</span>
</div>
</td>
<td class="px-4 py-3">
<span class="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">10A1</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center gap-2">
<span class="text-slate-900 dark:text-slate-100 text-sm font-bold">7.0</span>
<span class="material-symbols-outlined text-green-500 text-sm" title="Saved">check_circle</span>
</div>
</td>
<td class="px-4 py-3 text-right">
<button class="text-slate-400 hover:text-primary transition-colors p-1" title="Edit Score">
<span class="material-symbols-outlined text-lg">edit_note</span>
</button>
<button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 ml-2" title="Edit Student">
<span class="material-symbols-outlined text-lg">edit</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Pagination -->
<div class="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
<span class="text-sm text-slate-500 dark:text-slate-400">Showing 1 to 5 of 120 students</span>
<div class="flex items-center gap-1">
<button class="flex w-8 h-8 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled="">
<span class="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button class="w-8 h-8 items-center justify-center text-sm font-medium rounded bg-primary text-white">1</button>
<button class="w-8 h-8 items-center justify-center text-sm font-medium rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">2</button>
<button class="w-8 h-8 items-center justify-center text-sm font-medium rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">3</button>
<span class="w-8 h-8 flex items-center justify-center text-slate-500">...</span>
<button class="w-8 h-8 items-center justify-center text-sm font-medium rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">24</button>
<button class="flex w-8 h-8 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
</div>`,O=`<div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div class="layout-container flex h-full grow flex-col">
<div class="px-40 flex flex-1 justify-center py-5">
<div class="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full bg-white dark:bg-slate-900 shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
<!-- TopNavBar -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200 dark:border-b-slate-800 px-10 py-3 bg-white dark:bg-slate-900">
<div class="flex items-center gap-8">
<div class="flex items-center gap-4 text-slate-900 dark:text-slate-100">
<div class="size-6 text-primary">
<span class="material-symbols-outlined text-[24px]">school</span>
</div>
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">Hệ thống Thi</h2>
</div>
<nav class="flex items-center gap-9">
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Trang chủ</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Kỳ thi</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Kết quả</a>
<a class="text-primary dark:text-primary text-sm font-bold leading-normal border-b-2 border-primary pb-1" href="#">Báo cáo</a>
</nav>
</div>
<div class="flex flex-1 justify-end gap-8">
<label class="flex flex-col min-w-40 !h-10 max-w-64">
<div class="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
<div class="text-slate-500 flex items-center justify-center pl-4">
<span class="material-symbols-outlined text-[20px]">search</span>
</div>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 px-4 pl-2 text-sm font-normal leading-normal" placeholder="Tìm kiếm..." value=""/>
</div>
</label>
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-slate-200 dark:ring-slate-700 cursor-pointer" data-alt="User avatar placeholder" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWuP2kdkO30BGtV4OwsiCpieq950VCJ4n1peXzc1LgxECY0eNMMELgrSzJ9BH3ZJXI3FGt2Eey-K0FspDht7Ikn6VbcyWQzGwrdg4V2doxGPsfmZ28QovEnafqpnhBNlsmXMg5V6Wd0eg8rSnKRSzh5BwpYasMp9NNu3smqGBmXv8Gq68f0JG-bTiZOl4OGWgBfRrdNPADN44vlULMtskB-XAWRS4i0pzojAC3AhS-vvGRqkWxq0x6LOqwNmgTgwa_1pGN9cEbWGk");'></div>
</div>
</header>
<div class="p-8 pb-4">
<div class="flex flex-wrap justify-between items-end gap-4 mb-6">
<div class="flex flex-col gap-2">
<p class="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Báo cáo &amp; Kết quả thi</p>
<p class="text-slate-500 dark:text-slate-400 text-base font-medium flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">calendar_today</span>
                                Kỳ thi cuối kỳ - Môn Toán học
                            </p>
</div>
<div class="flex gap-3">
<button class="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-bold shadow-sm">
<span class="material-symbols-outlined text-[18px]">description</span>
<span>Xuất PDF</span>
</button>
<button class="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-primary/90 text-white transition-colors text-sm font-bold shadow-sm">
<span class="material-symbols-outlined text-[18px]">table</span>
<span>Xuất Excel</span>
</button>
</div>
</div>
<!-- Stats Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
<div class="flex flex-col gap-3 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
<div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-primary">groups</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">Tổng thí sinh</p>
<p class="text-slate-900 dark:text-white text-4xl font-black leading-tight relative z-10">150</p>
<div class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1 relative z-10">
<span class="material-symbols-outlined text-[16px]">trending_up</span>
<span>+12% so với kỳ trước</span>
</div>
</div>
<div class="flex flex-col gap-3 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
<div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-primary">score</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">Điểm trung bình</p>
<p class="text-slate-900 dark:text-white text-4xl font-black leading-tight relative z-10">7.2</p>
<div class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1 relative z-10">
<span class="material-symbols-outlined text-[16px]">trending_up</span>
<span>+0.5 điểm</span>
</div>
</div>
<div class="flex flex-col gap-3 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
<div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-emerald-500">check_circle</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">Tỷ lệ đạt</p>
<p class="text-emerald-600 dark:text-emerald-400 text-4xl font-black leading-tight relative z-10">85%</p>
<div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 relative z-10">
<div class="bg-emerald-500 h-1.5 rounded-full" style="width: 85%"></div>
</div>
</div>
<div class="flex flex-col gap-3 rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
<div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl text-rose-500">cancel</span>
</div>
<p class="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">Tỷ lệ trượt</p>
<p class="text-rose-600 dark:text-rose-400 text-4xl font-black leading-tight relative z-10">15%</p>
<div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 relative z-10">
<div class="bg-rose-500 h-1.5 rounded-full" style="width: 15%"></div>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
<!-- Histogram -->
<div class="col-span-1 lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
<div class="flex justify-between items-start mb-6">
<div>
<h3 class="text-slate-900 dark:text-white text-lg font-bold">Biểu đồ phổ điểm</h3>
<p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Phân bố điểm số của 150 sinh viên</p>
</div>
<div class="p-2 bg-primary/10 rounded-lg text-primary">
<span class="material-symbols-outlined">bar_chart</span>
</div>
</div>
<div class="grid min-h-[220px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-2 mt-4">
<div class="w-full flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative">
<div class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">5 sv</div>
<div class="bg-slate-200 dark:bg-slate-700 group-hover:bg-primary/50 transition-colors w-full rounded-t-sm" style="height: 10%;"></div>
</div>
<p class="text-slate-500 text-xs font-semibold mt-2">0-2</p>
<div class="w-full flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative">
<div class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">15 sv</div>
<div class="bg-slate-200 dark:bg-slate-700 group-hover:bg-primary/50 transition-colors w-full rounded-t-sm" style="height: 25%;"></div>
</div>
<p class="text-slate-500 text-xs font-semibold mt-2">2-4</p>
<div class="w-full flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative">
<div class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">45 sv</div>
<div class="bg-slate-200 dark:bg-slate-700 group-hover:bg-primary/70 transition-colors w-full rounded-t-sm" style="height: 60%;"></div>
</div>
<p class="text-slate-500 text-xs font-semibold mt-2">4-6</p>
<div class="w-full flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative">
<div class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">60 sv</div>
<div class="bg-primary dark:bg-primary w-full rounded-t-sm shadow-[0_0_10px_rgba(19,109,236,0.3)]" style="height: 85%;"></div>
</div>
<p class="text-slate-900 dark:text-slate-100 text-xs font-bold mt-2">6-8</p>
<div class="w-full flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative">
<div class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">25 sv</div>
<div class="bg-slate-200 dark:bg-slate-700 group-hover:bg-primary/50 transition-colors w-full rounded-t-sm" style="height: 40%;"></div>
</div>
<p class="text-slate-500 text-xs font-semibold mt-2">8-10</p>
</div>
</div>
<!-- Detailed Table -->
<div class="col-span-1 lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
<div class="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
<div>
<h3 class="text-slate-900 dark:text-white text-lg font-bold">Danh sách chi tiết</h3>
</div>
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">filter_list</span>
<select class="pl-9 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary appearance-none cursor-pointer">
<option>Tất cả kết quả</option>
<option>Đạt (&gt;=5.0)</option>
<option>Trượt (&lt;5.0)</option>
</select>
</div>
</div>
<div class="overflow-x-auto flex-1">
<table class="w-full text-left text-sm">
<thead class="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-xs">
<tr>
<th class="px-6 py-4">Mã SV</th>
<th class="px-6 py-4">Họ và tên</th>
<th class="px-6 py-4">Lớp</th>
<th class="px-6 py-4 text-center">Điểm số</th>
<th class="px-6 py-4 text-center">Trạng thái</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-100 dark:divide-slate-800/50">
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">SV001</td>
<td class="px-6 py-4 text-slate-700 dark:text-slate-300">Nguyễn Văn An</td>
<td class="px-6 py-4 text-slate-500 dark:text-slate-400">TH21A</td>
<td class="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">8.5</td>
<td class="px-6 py-4 text-center">
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Đạt</span>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">SV002</td>
<td class="px-6 py-4 text-slate-700 dark:text-slate-300">Trần Thị Bình</td>
<td class="px-6 py-4 text-slate-500 dark:text-slate-400">TH21B</td>
<td class="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">7.0</td>
<td class="px-6 py-4 text-center">
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Đạt</span>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">SV003</td>
<td class="px-6 py-4 text-slate-700 dark:text-slate-300">Lê Hoàng Cường</td>
<td class="px-6 py-4 text-slate-500 dark:text-slate-400">TH21A</td>
<td class="px-6 py-4 text-center font-bold text-rose-600 dark:text-rose-400">4.5</td>
<td class="px-6 py-4 text-center">
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800">Trượt</span>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">SV004</td>
<td class="px-6 py-4 text-slate-700 dark:text-slate-300">Phạm Mai Dung</td>
<td class="px-6 py-4 text-slate-500 dark:text-slate-400">TH21C</td>
<td class="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">9.2</td>
<td class="px-6 py-4 text-center">
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Đạt</span>
</td>
</tr>
<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td class="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">SV005</td>
<td class="px-6 py-4 text-slate-700 dark:text-slate-300">Hoàng Văn Em</td>
<td class="px-6 py-4 text-slate-500 dark:text-slate-400">TH21B</td>
<td class="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">6.8</td>
<td class="px-6 py-4 text-center">
<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Đạt</span>
</td>
</tr>
</tbody>
</table>
</div>
<div class="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
<span>Hiển thị 1-5 của 150 sinh viên</span>
<div class="flex gap-1">
<button class="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled="">Trước</button>
<button class="px-3 py-1 rounded border border-primary bg-primary text-white font-medium">1</button>
<button class="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
<button class="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">3</button>
<span class="px-2 py-1">...</span>
<button class="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">Sau</button>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>`,q={login:{html:H,init:V},dashboard:{html:N,init:z},questions:{html:C,init:R},settings:{html:M,init:F},base_score:{html:$,init:G},reports:{html:O,init:K}};document.getElementById("app");const k=document.getElementById("workarea"),B=document.getElementById("loginarea"),L=document.getElementById("sidebar");function _(e){q[e]&&(e==="login"?(L==null||L.classList.add("hidden"),k==null||k.classList.add("hidden"),B==null||B.classList.remove("hidden"),B&&(B.innerHTML=q[e].html)):(L==null||L.classList.remove("hidden"),L==null||L.classList.add("flex"),B==null||B.classList.add("hidden"),k==null||k.classList.remove("hidden"),k==null||k.classList.add("flex"),k&&(k.innerHTML=q[e].html)),document.querySelectorAll("#sidebar .nav-link").forEach(t=>{t.getAttribute("data-route")===e?(t.classList.add("bg-primary/10","text-primary"),t.classList.remove("text-slate-600","dark:text-slate-400")):(t.classList.remove("bg-primary/10","text-primary"),t.getAttribute("data-route")!=="login"&&t.classList.add("text-slate-600","dark:text-slate-400"))}),q[e].init(),D())}function D(){document.querySelectorAll("[data-route]").forEach(e=>{e.onclick=t=>{t.preventDefault();const x=e.getAttribute("data-route");x&&_(x)}})}function V(){const e=document.querySelector("#loginarea button");e&&e.addEventListener("click",t=>{t.preventDefault(),_("settings")})}function z(){const e=document.getElementById("dashboard-exam-select"),t=document.getElementById("candidates-grid"),x=document.getElementById("dashboard-exam-stats"),r=document.getElementById("btn-dashboard-start");let s=null,l=null;async function d(){try{const h=await(await fetch("http://localhost:3000/api/exams")).json();e&&(e.innerHTML='<option value="">Chọn kỳ thi...</option>'+h.map(o=>`<option value="${o.id}" data-status="${o.status}">${o.name} - ${o.status}</option>`).join(""))}catch(m){console.error(m)}}async function f(){if(s)try{const h=await(await fetch(`http://localhost:3000/api/exams/${s}/rooms`)).json();if(h.length===0){t&&(t.innerHTML='<div class="col-span-full text-center py-8 text-slate-500">Kỳ thi này chưa có phòng thi nào.</div>');return}l=h[0].id;const w=await(await fetch(`http://localhost:3000/api/rooms/${l}/candidates`)).json();v(w)}catch(m){console.error(m)}}function v(m){if(!t||!x)return;let h=0,o=m.length;if(o===0){t.innerHTML='<div class="col-span-full text-center py-8 text-slate-500">Phòng này chưa có thí sinh nào. Có thể thêm thông qua API hoặc CSDL.</div>',x.innerText="Sĩ số: 0 | Đang thi: 0 | Ngoại tuyến: 0";return}let w="";m.forEach(u=>{const c=u.is_online===1;c&&h++;const p=u.collision_pc?`<div class="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[10px] text-center py-0.5 animate-pulse z-10 rounded-b-xl">⚠ Đột nhập từ: ${u.collision_pc}</div>`:"",b=c?"border-green-500 shadow-green-100 dark:shadow-green-900/20":"border-slate-200 dark:border-slate-700 opacity-70",y=c?"bg-green-500":"bg-slate-300 dark:bg-slate-600",g=c?"Online":"Offline",T=u.pc_name?u.pc_name.length>20?u.pc_name.substring(0,20)+"...":u.pc_name:"N/A";w+=`
				<div class="bg-white dark:bg-slate-800 border-2 ${b} rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300 pb-6">
					<div class="flex justify-between items-start mb-3">
						<div class="flex items-center">
							<div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 font-bold text-slate-500 dark:text-slate-400">
								${u.name.charAt(0)}
							</div>
							<div>
								<h3 class="font-medium text-slate-900 dark:text-white line-clamp-1 text-sm" title="${u.name}">${u.name}</h3>
								<p class="text-[11px] text-slate-500 font-mono">${u.sbd} - ${T}</p>
							</div>
						</div>
						<div class="flex flex-col items-end">
							<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap">
								<span class="w-1.5 h-1.5 rounded-full ${y} mr-1"></span>
								${g}
							</span>
						</div>
					</div>
					<div class="mt-2 pt-3 border-t border-slate-100 dark:border-slate-700">
						<div class="flex justify-between text-[11px] mb-1">
							<span class="text-slate-500">Tiến độ (Demo)</span>
							<span class="font-medium">N/A</span>
						</div>
						<div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
							<div class="bg-primary h-1.5 rounded-full w-0 transition-all duration-500"></div>
						</div>
					</div>
					${p}
				</div>
			`}),t.innerHTML=w,x.innerText=`Sĩ số: ${o} | Online: ${h} | Ngoại tuyến: ${o-h}`}e==null||e.addEventListener("change",m=>{if(s=parseInt(m.target.value),!s){t&&(t.innerHTML='<div class="col-span-full text-center py-8 text-slate-500 font-medium">Vui lòng chọn kỳ thi để xem danh sách phòng.</div>'),r&&r.classList.add("hidden");return}const o=e.options[e.selectedIndex].getAttribute("data-status");r&&(o==="PENDING"?r.classList.remove("hidden"):r.classList.add("hidden")),f()}),r==null||r.addEventListener("click",async()=>{if(s&&confirm("Bắt đầu kỳ thi này? Việc này sẽ bắt đầu thời gian làm bài của toàn bộ thí sinh!"))try{await fetch(`http://localhost:3000/api/exams/${s}/start`,{method:"POST"}),d(),f(),r.classList.add("hidden")}catch(m){alert(m)}}),window._monitorInterval&&clearInterval(window._monitorInterval),window._monitorInterval=setInterval(()=>{s&&document.getElementById("dashboard-exam-select")?f():document.getElementById("dashboard-exam-select")||clearInterval(window._monitorInterval)},3e3),d()}function R(){var b,y,g,T;let e=null,t=[],x=[];const r=document.getElementById("questions-tbody"),s=document.getElementById("filter-subject"),l=document.getElementById("q-subject"),d=document.getElementById("question-form-panel"),f=document.getElementById("question-form");async function v(){try{x=await(await fetch("http://localhost:3000/api/subjects")).json(),m()}catch(a){console.error(a)}}function m(){if(!s||!l)return;let a='<option value="">Tất cả môn</option>',n="";x.forEach(i=>{a+=`<option value="${i.id}">${i.name}</option>`,n+=`<option value="${i.id}">${i.name}</option>`}),a+='<option value="NEW_SUBJECT" class="text-primary font-bold">+ Thêm môn thi mới</option>',s.innerHTML=a,l.innerHTML=n,x.length>0&&!e&&(e=x[0].id,s.value=e.toString()),o()}async function h(){const a=prompt("Nhập tên môn thi mới:");if(!a){v();return}const n=prompt("Nhập mã môn thi (viết liền không dấu, ví dụ: TOAN):");if(!n){v();return}try{e=(await(await fetch("http://localhost:3000/api/subjects",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a,code:n})})).json()).id,await v()}catch(i){alert("Lỗi tạo môn thi: "+i),v()}}async function o(){if(r){if(!e){r.innerHTML='<tr><td colspan="5" class="text-center py-4 text-slate-500">Vui lòng chọn hoặc thêm môn thi.</td></tr>';return}try{t=await(await fetch(`http://localhost:3000/api/subjects/${e}/questions`)).json(),w()}catch(a){console.error(a)}}}function w(){if(!r)return;if(t.length===0){r.innerHTML='<tr><td colspan="5" class="text-center py-4 text-slate-500">Chưa có câu hỏi nào trong môn này.</td></tr>';return}let a="";t.forEach(n=>{var j;const i=(j=x.find(S=>S.id===n.subject_id))==null?void 0:j.name,E=n.level==="EASY"?"text-green-700 bg-green-100":n.level==="MEDIUM"?"text-yellow-700 bg-yellow-100":"text-red-700 bg-red-100";a+=`
		  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
			  <td class="px-4 py-3 text-sm text-slate-500">${n.id}</td>
			  <td class="px-4 py-3 text-sm">${n.content}</td>
			  <td class="px-4 py-3 text-sm hidden @md:table-cell"><span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">${i}</span></td>
			  <td class="px-4 py-3 text-sm hidden @lg:table-cell"><span class="px-2 py-1 ${E} rounded text-xs">${n.level}</span></td>
			  <td class="px-4 py-3 text-sm text-center flex justify-center gap-2">
				  <button class="text-slate-400 hover:text-primary" onclick="window.editQuestion(${n.id})"><span class="material-symbols-outlined text-sm">edit</span></button>
				  <button class="text-slate-400 hover:text-red-500" onclick="window.deleteQuestion(${n.id})"><span class="material-symbols-outlined text-sm">delete</span></button>
			  </td>
		  </tr>`}),r.innerHTML=a}window.editQuestion=a=>u(a),window.deleteQuestion=async a=>{if(confirm("Bạn có chắc xoá câu hỏi này?"))try{await fetch(`http://localhost:3000/api/questions/${a}`,{method:"DELETE"}),o()}catch(n){alert(n)}};function u(a=null){d==null||d.classList.remove("hidden"),d==null||d.classList.add("flex");const n=document.getElementById("form-title");if(f==null||f.reset(),a){n&&(n.innerHTML=`<span class="material-symbols-outlined text-primary text-xl">edit_square</span> Chỉnh Sửa Câu #${a}`);const i=t.find(E=>E.id===a);if(i){document.getElementById("q-content").value=i.content;const E=JSON.parse(i.options||"[]"),j=document.querySelectorAll(".q-option");E.forEach((A,I)=>j[I]&&(j[I].value=A));const S=document.querySelector(`input[name="q_correct_answer"][value="${i.correct_answer}"]`);S&&(S.checked=!0),document.getElementById("q-difficulty").value=i.level,l&&(l.value=i.subject_id.toString())}}else n&&(n.innerHTML='<span class="material-symbols-outlined text-primary text-xl">add_box</span> Tạo Câu Hỏi Mới'),e&&l&&(l.value=e.toString())}function c(){d==null||d.classList.add("hidden"),d==null||d.classList.remove("flex")}async function p(){const a=parseInt(l.value),n=document.getElementById("q-difficulty").value,i=document.getElementById("q-content").value,E=document.querySelectorAll(".q-option"),j=Array.from(E).map(I=>I.value),S=document.querySelector('input[name="q_correct_answer"]:checked');if(!S){alert("Vui lòng chọn đáp án đúng!");return}const A=parseInt(S.value);try{(await fetch("http://localhost:3000/api/questions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject_id:a,level:n,content:i,options:j,correct_answer:A})})).ok?(c(),o()):alert("Lỗi khi lưu câu hỏi")}catch(I){alert(I)}}(b=document.getElementById("btn-new-question"))==null||b.addEventListener("click",()=>u(null)),(y=document.getElementById("btn-cancel-edit"))==null||y.addEventListener("click",c),f==null||f.addEventListener("submit",a=>{a.preventDefault(),p()}),(g=document.getElementById("btn-import-questions"))==null||g.addEventListener("click",()=>{if(!e){alert("Hãy chọn 1 môn thi trước khi Import");return}alert("Tính năng chọn file Excel đang được phát triển... (Giả lập thành công import 50 câu)."),o()}),(T=document.getElementById("btn-export-questions"))==null||T.addEventListener("click",()=>{if(!e){alert("Hãy chọn 1 môn thi trước khi Export");return}alert("Đang tải xuống file Excel...")}),s==null||s.addEventListener("change",a=>{const n=a.target.value;if(n==="NEW_SUBJECT"){h();return}e=n?parseInt(n):null,o()}),v(),c()}function F(){const e=document.getElementById("exam-list"),t=document.getElementById("exam-form-panel"),x=document.getElementById("btn-create-exam"),r=document.getElementById("btn-close-exam-form"),s=document.getElementById("btn-cancel-exam"),l=document.getElementById("btn-save-exam"),d=document.getElementById("exam-subject");let f=[],v=[];async function m(){try{f=await(await fetch("http://localhost:3000/api/subjects")).json(),v=await(await fetch("http://localhost:3000/api/exams")).json(),h()}catch{e&&(e.innerHTML='<tr><td colspan="4" class="text-center py-4 text-red-500">Lỗi tải dữ liệu.</td></tr>')}}function h(){if(!e)return;if(v.length===0){e.innerHTML='<tr><td colspan="4" class="text-center py-4 text-slate-500">Chưa có kỳ thi nào.</td></tr>';return}let c="";v.forEach(p=>{var a;const b=JSON.parse(p.config),y=((a=f.find(n=>n.id===b.subject_id))==null?void 0:a.name)||"N/A";let g='<span class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">ĐÃ KẾT THÚC</span>',T='<span class="text-sm text-slate-400">Đã khóa</span>';p.status==="PENDING"?(g='<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">CHƯA BẮT ĐẦU</span>',T=`<button class="btn-start-exam text-sm font-medium text-primary hover:underline" data-id="${p.id}">Bắt đầu thi</button>`):p.status==="ACTIVE"&&(g='<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">ĐANG THI</span>',T=`<button class="btn-monitor-exam text-sm font-medium text-green-600 hover:underline" data-id="${p.id}">Giám sát</button>`),c+=`
				<tr class="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
					<td class="px-6 py-4 text-sm font-medium">#${p.id}</td>
					<td class="px-6 py-4">
						<div class="font-bold text-slate-900 dark:text-white">${p.name}</div>
						<div class="text-xs text-slate-500 mt-1">Môn: ${y} | ${b.easy} Dễ - ${b.medium} TB - ${b.hard} Khó</div>
					</td>
					<td class="px-6 py-4">${g}</td>
					<td class="px-6 py-4">${T}</td>
				</tr>
			`}),e.innerHTML=c,document.querySelectorAll(".btn-start-exam").forEach(p=>{p.addEventListener("click",async b=>{const y=b.target.getAttribute("data-id");if(confirm("Bạn có chắc muốn bắt đầu kỳ thi này? Việc này sẽ sinh cấu trúc đề ngẫu nhiên cho toàn bộ thí sinh trong phòng và không có cách nào hoàn tác!"))try{await fetch(`http://localhost:3000/api/exams/${y}/start`,{method:"POST"}),m()}catch(g){alert(g)}})}),document.querySelectorAll(".btn-monitor-exam").forEach(p=>{p.addEventListener("click",b=>{b.target.getAttribute("data-id"),_("dashboard")})})}function o(){t==null||t.classList.remove("hidden"),t==null||t.classList.add("flex"),d&&(d.innerHTML=f.map(c=>`<option value="${c.id}">${c.name}</option>`).join(""))}function w(){t==null||t.classList.add("hidden"),t==null||t.classList.remove("flex")}async function u(){const c=document.getElementById("exam-name").value,p=parseInt(document.getElementById("exam-subject").value),b=document.getElementById("exam-start"),y=document.getElementById("exam-end");if(!c||isNaN(p)||!b.value||!y.value){alert("Vui lòng điền đầy đủ thông tin Tên, Môn thi, Thời gian!");return}const g=new Date(b.value).toISOString(),T=new Date(y.value).toISOString(),a=parseInt(document.getElementById("exam-easy").value)||0,n=parseInt(document.getElementById("exam-medium").value)||0,i=parseInt(document.getElementById("exam-hard").value)||0,E={subject_id:p,easy:a,medium:n,hard:i};try{const S=await(await fetch("http://localhost:3000/api/exams",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:c,start_time:g,end_time:T,config:E})})).json();await fetch("http://localhost:3000/api/rooms",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({exam_id:S.id,name:"Phòng Thi 1"})}),w(),m()}catch(j){alert("Lỗi tạo kỳ thi: "+j)}}x==null||x.addEventListener("click",o),r==null||r.addEventListener("click",w),s==null||s.addEventListener("click",w),l==null||l.addEventListener("click",u),m()}function G(){}function K(){}_("settings");
