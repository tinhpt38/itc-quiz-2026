import './style.css';
import loginHtml from './templates/login.html?raw';
import subjectsHtml from './templates/subjects.html?raw';
import dashboardHtml from './templates/dashboard.html?raw';
import questionsHtml from './templates/questions.html?raw';
import settingsHtml from './templates/settings.html?raw';
import baseScoreHtml from './templates/base_score.html?raw';
import reportsHtml from './templates/reports.html?raw';

const API_BASE = (typeof window !== 'undefined' && (window as any).__API_BASE__) || 'http://localhost:3000';

const routes = {
	login: { html: loginHtml, init: initLogin },
	subjects: { html: subjectsHtml, init: initSubjects },
	dashboard: { html: dashboardHtml, init: initDashboard },
	questions: { html: questionsHtml, init: initQuestions },
	settings: { html: settingsHtml, init: initSettings },
	base_score: { html: baseScoreHtml, init: initBaseScore },
	reports: { html: reportsHtml, init: initReports }
};

const appContainer = document.getElementById('app');
const workarea = document.getElementById('workarea');
const loginarea = document.getElementById('loginarea');
const sidebar = document.getElementById('sidebar');

export function navigateTo(route: keyof typeof routes) {
	if (!routes[route]) return;

	if (route === 'login') {
		sidebar?.classList.add('hidden');
		workarea?.classList.add('hidden');
		loginarea?.classList.remove('hidden');
		if (loginarea) loginarea.innerHTML = routes[route].html;
	} else {
		sidebar?.classList.remove('hidden');
		sidebar?.classList.add('flex');
		loginarea?.classList.add('hidden');
		workarea?.classList.remove('hidden');
		workarea?.classList.add('flex');
		if (workarea) workarea.innerHTML = routes[route].html;
	}

	// Update active nav link
	document.querySelectorAll('#sidebar .nav-link').forEach(el => {
		if (el.getAttribute('data-route') === route) {
			el.classList.add('bg-primary/10', 'text-primary');
			el.classList.remove('text-slate-600');
		} else {
			el.classList.remove('bg-primary/10', 'text-primary');
			if (el.getAttribute('data-route') !== 'login') el.classList.add('text-slate-600');
		}
	});

	routes[route].init();
	setupNavigationBindings(); // rebind universal links after rendering
}

function setupNavigationBindings() {
	document.querySelectorAll('[data-route]').forEach(el => {
		(el as HTMLElement).onclick = (e) => {
			e.preventDefault();
			const route = el.getAttribute('data-route') as keyof typeof routes;
			if (route) navigateTo(route);
		};
	});
}

function initLogin() {
	const btn = document.querySelector('#loginarea button');
	if (btn) {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			navigateTo('subjects');
		});
	}
}

function initSubjects() {
	const tbody = document.getElementById('subjects-tbody');
	const modal = document.getElementById('subject-modal');
	const form = document.getElementById('subject-form') as HTMLFormElement;
	const titleEl = document.getElementById('subject-modal-title');
	const idInput = document.getElementById('subject-id') as HTMLInputElement;
	const nameInput = document.getElementById('subject-name') as HTMLInputElement;
	const codeInput = document.getElementById('subject-code') as HTMLInputElement;

	async function loadSubjects() {
		if (!tbody) return;
		try {
			const res = await fetch(`${API_BASE}/api/subjects`);
			const list = await res.json();
			if (list.length === 0) {
				tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-slate-500">Chưa có môn học. Bấm "Thêm môn học" để tạo.</td></tr>';
				return;
			}
			tbody.innerHTML = list.map((s: any) => `
				<tr class="hover:bg-slate-50 transition-colors">
					<td class="px-6 py-4 text-sm text-slate-500">${s.id}</td>
					<td class="px-6 py-4 text-sm font-medium text-slate-900">${escapeHtml(s.name)}</td>
					<td class="px-6 py-4 text-sm text-slate-600">${escapeHtml(s.code || '—')}</td>
					<td class="px-6 py-4 text-right">
						<button type="button" class="edit-subject text-primary hover:underline text-sm font-medium mr-2" data-id="${s.id}" data-name="${escapeAttr(s.name)}" data-code="${escapeAttr(s.code || '')}">Sửa</button>
						<button type="button" class="delete-subject text-red-600 hover:underline text-sm font-medium" data-id="${s.id}">Xóa</button>
					</td>
				</tr>
			`).join('');
			tbody.querySelectorAll('.edit-subject').forEach(btn => {
				btn.addEventListener('click', () => {
					const id = (btn as HTMLElement).getAttribute('data-id');
					const name = (btn as HTMLElement).getAttribute('data-name');
					const code = (btn as HTMLElement).getAttribute('data-code');
					if (idInput) idInput.value = id || '';
					if (nameInput) nameInput.value = name || '';
					if (codeInput) codeInput.value = code || '';
					if (titleEl) titleEl.textContent = 'Sửa môn học';
					modal?.classList.remove('hidden');
					modal?.classList.add('flex');
				});
			});
			tbody.querySelectorAll('.delete-subject').forEach(btn => {
				btn.addEventListener('click', async () => {
					const id = (btn as HTMLElement).getAttribute('data-id');
					if (!id || !confirm('Xóa môn học này? Câu hỏi thuộc môn sẽ cần xử lý riêng.')) return;
					try {
						await fetch(`${API_BASE}/api/subjects/${id}`, { method: 'DELETE' });
						loadSubjects();
					} catch (e) { alert('Lỗi: ' + e); }
				});
			});
		} catch (e) {
			tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-red-500">Lỗi tải dữ liệu.</td></tr>';
		}
	}

	function escapeHtml(s: string) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
	function escapeAttr(s: string) { return escapeHtml(s).replace(/"/g, '&quot;'); }

	document.getElementById('btn-create-subject')?.addEventListener('click', () => {
		if (idInput) idInput.value = '';
		if (nameInput) nameInput.value = '';
		if (codeInput) codeInput.value = '';
		if (titleEl) titleEl.textContent = 'Thêm môn học';
		modal?.classList.remove('hidden');
		modal?.classList.add('flex');
	});
	document.getElementById('subject-modal-close')?.addEventListener('click', () => { modal?.classList.add('hidden'); modal?.classList.remove('flex'); });
	document.getElementById('subject-modal-cancel')?.addEventListener('click', () => { modal?.classList.add('hidden'); modal?.classList.remove('flex'); });
	document.getElementById('subject-modal-save')?.addEventListener('click', async () => {
		const name = nameInput?.value?.trim();
		if (!name) { alert('Nhập tên môn học.'); return; }
		const code = codeInput?.value?.trim() || undefined;
		const id = idInput?.value;
		try {
			if (id) {
				await fetch(`${API_BASE}/api/subjects/${id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name, code })
				});
			} else {
				await fetch(`${API_BASE}/api/subjects`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name, code })
				});
			}
			modal?.classList.add('hidden');
			modal?.classList.remove('flex');
			loadSubjects();
		} catch (e) { alert('Lỗi: ' + e); }
	});

	loadSubjects();
}

function initDashboard() {
	const examSelect = document.getElementById('dashboard-exam-select') as HTMLSelectElement;
	const grid = document.getElementById('candidates-grid');
	const stats = document.getElementById('dashboard-exam-stats');
	const btnStart = document.getElementById('btn-dashboard-start');

	let currentExamId: number | null = null;
	let currentRoomId: number | null = null;

	async function loadExams() {
		try {
			const res = await fetch(`${API_BASE}/api/exams`);
			const exams = await res.json();
			if (examSelect) {
				examSelect.innerHTML = '<option value="">Chọn kỳ thi...</option>' + exams.map((e: any) => `<option value="${e.id}" data-status="${e.status}">${e.name} (${e.status})</option>`).join('');
			}
		} catch (e) { console.error(e); }
	}

	async function loadRoomAndCandidates() {
		if (!currentExamId) return;
		try {
			const rRes = await fetch(`${API_BASE}/api/exams/${currentExamId}/rooms`);
			const rooms = await rRes.json();
			if (rooms.length === 0) {
				if (grid) grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500">Kỳ thi này chưa có phòng thi nào.</div>';
				return;
			}
			currentRoomId = rooms[0].id;
			const cRes = await fetch(`${API_BASE}/api/exams/${currentExamId}/monitor`);
			const list = await cRes.json();
			renderCandidates(list);
		} catch (e) {
			console.error(e);
		}
	}

	function renderCandidates(candidates: any[]) {
		if (!grid || !stats) return;
		let onlineCount = 0;
		const totalCount = candidates.length;
		if (totalCount === 0) {
			grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500">Chưa có thí sinh nào trong kỳ thi này.</div>';
			stats.innerText = 'Sĩ số: 0 | Online: 0 | Ngoại tuyến: 0';
			return;
		}
		let html = '';
		candidates.forEach((c: any) => {
			const isOnline = c.status === 'online';
			if (isOnline) onlineCount++;
			const statusClass = isOnline ? 'border-green-500 shadow-green-100' : 'border-slate-200 opacity-70';
			const statusDot = isOnline ? 'bg-green-500' : 'bg-slate-300';
			const name = c.fullName || c.sbd || '—';
			html += `
				<div class="bg-white border-2 ${statusClass} rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300">
					<div class="flex justify-between items-start">
						<div class="flex items-center">
							<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 font-bold text-slate-500">${(name + '').charAt(0)}</div>
							<div>
								<h3 class="font-medium text-slate-900 text-sm line-clamp-1">${name}</h3>
								<p class="text-[11px] text-slate-500 font-mono">${c.sbd}</p>
							</div>
						</div>
						<span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 whitespace-nowrap">
							<span class="w-1.5 h-1.5 rounded-full ${statusDot} mr-1"></span>
							${isOnline ? 'Online' : 'Offline'}
						</span>
					</div>
					<div class="mt-2 pt-3 border-t border-slate-100">
						<div class="flex justify-between text-[11px]">
							<span class="text-slate-500">Đã làm</span>
							<span class="font-medium">${c.questionsAnswered ?? 0} câu</span>
						</div>
						<div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
							<div class="bg-primary h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
						</div>
					</div>
				</div>
			`;
		});
		grid.innerHTML = html;
		stats.innerText = `Sĩ số: ${totalCount} | Online: ${onlineCount} | Ngoại tuyến: ${totalCount - onlineCount}`;
	}

	examSelect?.addEventListener('change', (e) => {
		currentExamId = parseInt((e.target as HTMLSelectElement).value);
		if (!currentExamId) {
			if (grid) grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500 font-medium">Vui lòng chọn kỳ thi để xem danh sách phòng.</div>';
			if (btnStart) btnStart.classList.add('hidden');
			return;
		}

		const selectedOption = examSelect.options[examSelect.selectedIndex];
		const status = selectedOption.getAttribute('data-status');

		if (btnStart) {
			if (status === 'draft') btnStart.classList.remove('hidden');
			else btnStart.classList.add('hidden');
		}

		loadRoomAndCandidates();
	});

	btnStart?.addEventListener('click', async () => {
		if (!currentExamId) return;
		if (!confirm('Bắt đầu kỳ thi này? Việc này sẽ bắt đầu thời gian làm bài của toàn bộ thí sinh!')) return;
		try {
			await fetch(`${API_BASE}/api/exams/${currentExamId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'active' }) });
			loadExams();
			loadRoomAndCandidates();
			btnStart.classList.add('hidden');
		} catch (e) { alert(e); }
	});

	if ((window as any)._monitorInterval) clearInterval((window as any)._monitorInterval);
	(window as any)._monitorInterval = setInterval(() => {
		if (currentExamId && document.getElementById('dashboard-exam-select')) {
			loadRoomAndCandidates();
		} else if (!document.getElementById('dashboard-exam-select')) {
			clearInterval((window as any)._monitorInterval);
		}
	}, 3000);

	loadExams();
}
function initQuestions() {
	let currentSubjectId: number | null = null;
	let currentQuestions: any[] = [];
	let subjects: any[] = [];

	const tbody = document.getElementById('questions-tbody');
	const filterSubject = document.getElementById('filter-subject') as HTMLSelectElement;
	const filterModule = document.getElementById('filter-module') as HTMLSelectElement;
	const filterLevel = document.getElementById('filter-level') as HTMLSelectElement;
	const filterSearch = document.getElementById('filter-search') as HTMLInputElement;
	const formSubject = document.getElementById('q-subject') as HTMLSelectElement;
	const formPanel = document.getElementById('question-form-panel');
	const drawerBackdrop = document.getElementById('question-drawer-backdrop');
	const drawerOverlay = document.getElementById('question-drawer-overlay');
	const form = document.getElementById('question-form') as HTMLFormElement;
	let editingId: number | null = null;
	let searchQuery = '';

	function escapeHtml(s: string) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
	function stripHtml(html: string): string {
		if (!html) return '';
		const d = document.createElement('div');
		d.innerHTML = html;
		return (d.textContent || d.innerText || '').trim().replace(/\s+/g, ' ');
	}

	function initTinyMCE() {
		const el = document.getElementById('q-content');
		if (!el) return;
		const win = window as any;
		if (!win.tinymce) return;
		if (win.tinymce.get('q-content')) return;
		win.tinymce.init({
			target: el,
			base_url: 'https://cdn.jsdelivr.net/npm/tinymce@6.8.2',
			suffix: '.min',
			plugins: 'lists link code table',
			toolbar: 'undo redo | blocks | bold italic underline | numlist bullist | link | removeformat',
			menubar: false,
			height: 220,
			content_style: 'body { font-family: Inter, sans-serif; font-size: 14px; }',
			branding: false
		});
	}
	function getQuestionContent(): string {
		const win = window as any;
		const ed = win.tinymce?.get?.('q-content');
		if (ed) return (ed.getContent() || '').trim();
		return ((document.getElementById('q-content') as HTMLTextAreaElement)?.value || '').trim();
	}
	function setQuestionContent(html: string) {
		const win = window as any;
		const ed = win.tinymce?.get?.('q-content');
		if (ed) ed.setContent(html || '');
		else {
			const ta = document.getElementById('q-content') as HTMLTextAreaElement;
			if (ta) ta.value = html || '';
		}
	}
	function removeTinyMCE() {
		const win = window as any;
		if (win.tinymce?.get?.('q-content')) {
			win.tinymce.get('q-content').remove();
			tinyMceInited = false;
		}
	}

	async function fetchSubjects() {
		try {
			const res = await fetch(`${API_BASE}/api/subjects`);
			subjects = await res.json();
			const opts = subjects.map((s: any) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
			if (filterSubject) filterSubject.innerHTML = '<option value="">Chọn môn...</option>' + opts;
			if (formSubject) formSubject.innerHTML = opts || '<option value="">Chưa có môn</option>';
			if (subjects.length > 0 && !currentSubjectId) {
				currentSubjectId = subjects[0].id;
				if (filterSubject) filterSubject.value = String(currentSubjectId);
			}
			fetchQuestions();
		} catch (e) { console.error(e); }
	}

	async function fetchQuestions() {
		if (!tbody) return;
		if (!currentSubjectId) {
			tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">Chọn môn học để xem câu hỏi.</td></tr>';
			return;
		}
		try {
			let url = `${API_BASE}/api/subjects/${currentSubjectId}/questions`;
			const params = new URLSearchParams();
			if (filterModule?.value) params.set('module', filterModule.value);
			if (filterLevel?.value) params.set('level', filterLevel.value);
			if (params.toString()) url += '?' + params.toString();
			const res = await fetch(url);
			currentQuestions = await res.json();
			renderQuestions();
		} catch (e) {
			tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-6 text-center text-red-500">Lỗi tải câu hỏi.</td></tr>';
		}
	}

	function renderQuestions() {
		if (!tbody) return;
		const qs = searchQuery.trim()
			? currentQuestions.filter((q: any) => {
					const plain = stripHtml(q.text || '').toLowerCase();
					return plain.includes(searchQuery.trim().toLowerCase());
			  })
			: currentQuestions;
		if (qs.length === 0) {
			tbody.innerHTML = '<tr><td colspan="4" class="px-4 py-6 text-center text-slate-500">' +
				(searchQuery.trim() ? 'Không tìm thấy câu hỏi phù hợp.' : 'Chưa có câu hỏi. Bấm "Câu hỏi mới" để thêm.') + '</td></tr>';
			return;
		}
		const levelLabels: Record<number, string> = { 1: 'Dễ', 2: 'TB', 3: 'Khó' };
		const levelClass: Record<number, string> = { 1: 'text-green-700 bg-green-100', 2: 'text-amber-700 bg-amber-100', 3: 'text-red-700 bg-red-100' };
		tbody.innerHTML = qs.map((q: any) => {
			const plainPreview = stripHtml(q.text || '');
			const preview = plainPreview.length > 80 ? plainPreview.slice(0, 80) + '…' : plainPreview;
			return `
			<tr class="hover:bg-slate-50">
				<td class="px-4 py-3 text-sm text-slate-500">${q.id}</td>
				<td class="px-4 py-3 text-sm text-slate-900 max-w-md truncate" title="${escapeHtml(plainPreview)}">${escapeHtml(preview) || '—'}</td>
				<td class="px-4 py-3 text-sm"><span class="px-2 py-0.5 bg-slate-100 rounded text-xs">M${q.module ?? 1}</span> <span class="px-2 py-0.5 ${levelClass[q.level] || 'bg-slate-100'} rounded text-xs">${levelLabels[q.level] || q.level}</span></td>
				<td class="px-4 py-3 text-center">
					<button type="button" class="edit-q text-primary hover:underline text-sm font-medium mr-2" data-id="${q.id}">Sửa</button>
					<button type="button" class="del-q text-red-600 hover:underline text-sm font-medium" data-id="${q.id}">Xóa</button>
				</td>
			</tr>
		`;
		}).join('');
		tbody.querySelectorAll('.edit-q').forEach(btn => {
			btn.addEventListener('click', () => openForm(parseInt((btn as HTMLElement).getAttribute('data-id')!, 10)));
		});
		tbody.querySelectorAll('.del-q').forEach(btn => {
			btn.addEventListener('click', async () => {
				const id = (btn as HTMLElement).getAttribute('data-id');
				if (!id || !confirm('Xóa câu hỏi này?')) return;
				try {
					await fetch(`${API_BASE}/api/questions/${id}`, { method: 'DELETE' });
					fetchQuestions();
				} catch (e) { alert('Lỗi: ' + e); }
			});
		});
	}

	async function openForm(qId: number | null = null) {
		editingId = qId;
		// Mở drawer (trượt từ phải vào)
		drawerBackdrop?.classList.add('open');
		drawerOverlay?.classList.add('opacity-100');
		drawerOverlay?.classList.remove('opacity-0');
		formPanel?.classList.remove('translate-x-full');
		formPanel?.classList.add('translate-x-0');
		form?.reset();
		if (formSubject && currentSubjectId) formSubject.value = String(currentSubjectId);
		const title = document.getElementById('form-title');
		if (qId) {
			if (title) title.innerHTML = `<span class="material-symbols-outlined text-primary text-xl">edit_square</span> Chỉnh sửa câu #${qId}`;
			try {
				const res = await fetch(`${API_BASE}/api/questions/${qId}?admin=1`);
				const q = await res.json();
				if (!q) return;
				setQuestionContent(q.text || '');
				(document.getElementById('q-difficulty') as HTMLSelectElement).value = String(q.level);
				(document.getElementById('q-module') as HTMLSelectElement).value = String(q.module ?? 1);
				if (formSubject) formSubject.value = String(q.subject_id);
				const optionsInputs = document.querySelectorAll('.q-option') as NodeListOf<HTMLInputElement>;
				(q.answers || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).forEach((a: any, i: number) => {
					if (optionsInputs[i]) optionsInputs[i].value = a.text;
				});
				const correctIdx = (q.answers || []).findIndex((a: any) => a.is_correct === 1 || a.isCorrect);
				const radio = document.querySelector(`input[name="q_correct_answer"][value="${correctIdx >= 0 ? correctIdx : 0}"]`) as HTMLInputElement;
				if (radio) radio.checked = true;
			} catch (e) { alert('Không tải được câu hỏi: ' + e); }
		} else {
			if (title) title.textContent = 'Tạo câu hỏi mới';
			setQuestionContent('');
		}
	}

	function closeForm() {
		editingId = null;
		// Đóng drawer
		drawerBackdrop?.classList.remove('open');
		drawerOverlay?.classList.remove('opacity-100');
		drawerOverlay?.classList.add('opacity-0');
		formPanel?.classList.add('translate-x-full');
		formPanel?.classList.remove('translate-x-0');
	}

	async function saveQuestion() {
		const subjectId = parseInt(formSubject?.value || '0');
		if (!subjectId) { alert('Chọn môn thi.'); return; }
		const text = getQuestionContent();
		if (!text) { alert('Nhập nội dung câu hỏi.'); return; }
		const level = parseInt((document.getElementById('q-difficulty') as HTMLSelectElement).value || '1');
		const module = parseInt((document.getElementById('q-module') as HTMLSelectElement).value || '1');
		const optionsInputs = document.querySelectorAll('.q-option') as NodeListOf<HTMLInputElement>;
		const correctRadio = document.querySelector('input[name="q_correct_answer"]:checked') as HTMLInputElement;
		if (!correctRadio) { alert('Chọn đáp án đúng.'); return; }
		const correctIndex = parseInt(correctRadio.value);
		const answers = Array.from(optionsInputs).map((inp, i) => ({ text: inp.value.trim(), isCorrect: i === correctIndex }));
		if (answers.some(a => !a.text)) { alert('Điền đủ 4 đáp án.'); return; }
		try {
			if (editingId) await fetch(`${API_BASE}/api/questions/${editingId}`, { method: 'DELETE' });
			const res = await fetch(`${API_BASE}/api/subjects/${subjectId}/questions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text, level, module, answers })
			});
			if (res.ok) { closeForm(); fetchQuestions(); }
			else { const err = await res.json().catch(() => ({})); alert('Lỗi lưu: ' + (err.error || res.status)); }
		} catch (e) { alert('Lỗi: ' + e); }
	}

	document.getElementById('btn-new-question')?.addEventListener('click', () => openForm(null));
	document.getElementById('btn-cancel-edit')?.addEventListener('click', closeForm);
	form?.addEventListener('submit', (e) => { e.preventDefault(); saveQuestion(); });
	filterSubject?.addEventListener('change', () => {
		const v = filterSubject.value;
		currentSubjectId = v ? parseInt(v) : null;
		fetchQuestions();
	});
	filterModule?.addEventListener('change', () => fetchQuestions());
	filterLevel?.addEventListener('change', () => fetchQuestions());
	filterSearch?.addEventListener('input', () => {
		searchQuery = filterSearch?.value ?? '';
		renderQuestions();
	});

	// Click overlay (vùng tối) để đóng drawer
	drawerOverlay?.addEventListener('click', closeForm);

	fetchSubjects();
	closeForm();
	setTimeout(() => initTinyMCE(), 150);
}
function initSettings() {
	const examList = document.getElementById('exam-list');
	const formPanel = document.getElementById('exam-form-panel');
	const btnCreate = document.getElementById('btn-create-exam');
	const btnClose = document.getElementById('btn-close-exam-form');
	const btnCancel = document.getElementById('btn-cancel-exam');
	const btnSave = document.getElementById('btn-save-exam');
	const subjectSelect = document.getElementById('exam-subject') as HTMLSelectElement;

	let subjects: any[] = [];
	let exams: any[] = [];

	async function loadExams() {
		try {
			const subRes = await fetch(`${API_BASE}/api/subjects`);
			subjects = await subRes.json();

			const exRes = await fetch(`${API_BASE}/api/exams`);
			exams = await exRes.json();
			renderExams();
		} catch (e) {
			if (examList) examList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Lỗi tải dữ liệu.</td></tr>`;
		}
	}

		function renderExams() {
		if (!examList) return;
		if (exams.length === 0) {
			examList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-slate-500">Chưa có kỳ thi nào.</td></tr>`;
			return;
		}

		let html = '';
		exams.forEach((e: any) => {
			const subj = e.subject_name || subjects.find((s: any) => s.id === e.subject_id)?.name || 'N/A';
			const lc = e.level_config ? (typeof e.level_config === 'string' ? JSON.parse(e.level_config) : e.level_config) : {};
			const levelStr = [lc['1'], lc['2'], lc['3']].filter(Boolean).length ? `Cấp 1: ${lc['1'] || 0}% - Cấp 2: ${lc['2'] || 0}% - Cấp 3: ${lc['3'] || 0}%` : '';
			let statusBadge = '<span class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold">ĐÃ KẾT THÚC</span>';
			let actionBtn = '<span class="text-sm text-slate-400">Đã khóa</span>';

			if (e.status === 'draft') {
				statusBadge = '<span class="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">CHƯA BẮT ĐẦU</span>';
				actionBtn = `<button class="btn-start-exam text-sm font-medium text-primary hover:underline" data-id="${e.id}">Bắt đầu thi</button>`;
			} else if (e.status === 'active') {
				statusBadge = '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">ĐANG THI</span>';
				actionBtn = `<button class="btn-monitor-exam text-sm font-medium text-green-600 hover:underline" data-id="${e.id}">Giám sát</button>`;
			}

			html += `
				<tr class="border-b border-slate-100 hover:bg-slate-50">
					<td class="px-6 py-4 text-sm font-medium text-slate-700">#${e.id}</td>
					<td class="px-6 py-4">
						<div class="font-bold text-slate-900">${e.name}</div>
						<div class="text-xs text-slate-500 mt-1">Môn: ${subj}${levelStr ? ' | ' + levelStr : ''}</div>
					</td>
					<td class="px-6 py-4">${statusBadge}</td>
					<td class="px-6 py-4">${actionBtn}</td>
				</tr>
			`;
		});
		examList.innerHTML = html;

		document.querySelectorAll('.btn-start-exam').forEach(btn => {
			btn.addEventListener('click', async (ev) => {
				const id = (ev.target as HTMLElement).getAttribute('data-id');
				if (!confirm('Bạn có chắc muốn bắt đầu kỳ thi này? Việc này sẽ sinh cấu trúc đề ngẫu nhiên cho toàn bộ thí sinh trong phòng và không có cách nào hoàn tác!')) return;
				try {
					await fetch(`${API_BASE}/api/exams/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'active' }) });
					loadExams();
				} catch (err) { alert(err); }
			});
		});

		document.querySelectorAll('.btn-monitor-exam').forEach(btn => {
			btn.addEventListener('click', (ev) => {
				const id = (ev.target as HTMLElement).getAttribute('data-id');
				// Logic for monitoring room
				navigateTo('dashboard');
			});
		});
	}

	function openForm() {
		formPanel?.classList.remove('hidden');
		formPanel?.classList.add('flex');
		if (subjectSelect) {
			subjectSelect.innerHTML = subjects.map((s: any) => `<option value="${s.id}">${s.name}</option>`).join('');
		}
	}

	function closeForm() {
		formPanel?.classList.add('hidden');
		formPanel?.classList.remove('flex');
	}

	async function saveExam() {
		const name = (document.getElementById('exam-name') as HTMLInputElement).value.trim();
		const subjectId = parseInt((document.getElementById('exam-subject') as HTMLSelectElement).value);
		const startElem = document.getElementById('exam-start') as HTMLInputElement;
		const endElem = document.getElementById('exam-end') as HTMLInputElement;

		if (!name || isNaN(subjectId) || !startElem?.value || !endElem?.value) {
			alert('Vui lòng điền đầy đủ: Tên, Môn thi, Thời gian bắt đầu & kết thúc.');
			return;
		}

		const startedAt = new Date(startElem.value).toISOString();
		const endedAt = new Date(endElem.value).toISOString();
		const durationMinutes = Math.max(1, Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 60000));

		const easy = parseInt((document.getElementById('exam-easy') as HTMLInputElement).value) || 0;
		const medium = parseInt((document.getElementById('exam-medium') as HTMLInputElement).value) || 0;
		const hard = parseInt((document.getElementById('exam-hard') as HTMLInputElement).value) || 0;
		const total = easy + medium + hard || 1;
		const levelConfig = total > 0 ? { "1": Math.round((easy / total) * 100), "2": Math.round((medium / total) * 100), "3": Math.round((hard / total) * 100) } : undefined;

		try {
			const res = await fetch(`${API_BASE}/api/exams`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, subjectId, startedAt, endedAt, durationMinutes, levelConfig })
			});
			const exam = await res.json();
			if (exam?.id) {
				await fetch(`${API_BASE}/api/exams/${exam.id}/rooms`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: 'Phòng Thi 1' })
				});
			}
			closeForm();
			loadExams();
		} catch (e) {
			alert('Lỗi tạo kỳ thi: ' + e);
		}
	}

	btnCreate?.addEventListener('click', openForm);
	btnClose?.addEventListener('click', closeForm);
	btnCancel?.addEventListener('click', closeForm);
	btnSave?.addEventListener('click', saveExam);

	// Fetch exams on init
	loadExams();
}
function initBaseScore() { }
function initReports() { }

// Set initial route
navigateTo('subjects');
