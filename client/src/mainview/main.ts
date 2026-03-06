import './style.css';
import loginHtml from './templates/login.html?raw';
import confirmationHtml from './templates/confirmation.html?raw';
import quizHtml from './templates/quiz.html?raw';
import resultHtml from './templates/result.html?raw';

// Centralised state mapping for router
const routes = {
	login: { html: loginHtml, init: initLogin },
	confirmation: { html: confirmationHtml, init: initConfirmation },
	quiz: { html: quizHtml, init: initQuiz },
	result: { html: resultHtml, init: initResult }
};

const appContainer = document.getElementById('app')!;

export function navigateTo(route: keyof typeof routes) {
	if (!routes[route]) return;
	appContainer.innerHTML = routes[route].html;
	routes[route].init();
}

// Basic init functions
function initLogin() {
	const form = document.querySelector('form');
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			// Dummy action: Go to confirmation
			navigateTo('confirmation');
		});
	}
}

function initConfirmation() {
	const confirmBtn = document.querySelector('button');
	if (confirmBtn) {
		confirmBtn.addEventListener('click', () => {
			// Dummy action: Go to quiz
			navigateTo('quiz');
		});
	}
}

function initQuiz() {
	const nextBtn = document.querySelectorAll('button')[1];
	const submitBtn = document.querySelector('header button');
	if (submitBtn) {
		submitBtn.addEventListener('click', () => {
			navigateTo('result');
		});
	}
}

function initResult() { }

// Start app at login screen
navigateTo('login');
