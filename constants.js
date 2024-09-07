const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const loginButton = $('#button-login');
const registerButton = $('#button-register');
const registerForm = $('#form-register');
const loginForm = $('#form-login');
const mainForm = $('.main-form');
const mainContent = $('.main-content');
const registerLink = $('#register-link');
const loginLink = $('#login-link');
const askUserRegister = $('#ask-user-register');
const askUserLogin = $('#ask-user-login');
const rememberCheck = $('#remember-me');
const emailInputLogin = $('#email-login');
const passwordLoginField = $('#password-login');
const emailInputRegister = $('#email-register');
const passwordRegisterField = $('#password-register');
const rePasswordRegisterField = $('#re-password-register');
const imageChibi = $('.img-form');
const notificationUser = $('.notification-user');
const userActive = $('#user-active');
const logoutButton = $('#logout-button');
const inputTodo = $('.input-todo input');
const addTodoButton = $('.input-todo button');
const deleteAllTasksButton = $('#delete-all-tasks-button');
const pendingTasksCount = $('.pending-task');
const todoList = $('.todo-list');
const filterStatus = $('#filter');
const filterState = Object.freeze({
	DONE: 'done',
	UNDONE: 'undone',
	ALL: 'all',
});
const valueConstant = Object.freeze({
	NONE: 'none',
	NULL: '',
	BLOCK: 'block',
	FLEX: 'flex',
	ACTIVE: 'active',
});
const messages = Object.freeze({
	PASSWORD_DOES_NOT_MATCH: 'Password does not match. Please re-enter the password!',
	INVALID_EMAIL: 'Please enter a valid email address. Email must be in the format name@domain.com.',
	EMAIL_IS_ALREADY_REGISTERED: 'Already have this email registered!',
	REGISTER_SUCCESSFULLY: 'Register successfully!',
	WRONG_EMAIL:'Please enter correctly email!',
	USER_NOT_FOUND: 'User not found or Email/Password incorrect!',
	NO_TASK_HERE: 'Nothing to show here. Please add task',
});

const regexPattern = Object.freeze({
	EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
});