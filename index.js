let users, user, userTasks;
function generateUID() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

function validateEmail(email) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
}

function checkAvailableFormAndDisplay() {
	if (registerForm.style.display !== valueConstant.none) {
		registerForm.style.display = valueConstant.none;
		askUserRegister.style.display = valueConstant.none;
		loginForm.style.display = valueConstant.flex;
		askUserLogin.style.display = valueConstant.flex;
	} else {
		loginForm.style.display = valueConstant.none;
		askUserLogin.style.display = valueConstant.none;
		registerForm.style.display = valueConstant.flex;
		askUserRegister.style.display = valueConstant.flex;
	}
}

registerLink.addEventListener('click', function () {
	checkAvailableFormAndDisplay();
});

loginLink.addEventListener('click', function () {
	checkAvailableFormAndDisplay();
});

registerForm.addEventListener('submit', function (event) {
	event.preventDefault();

	if (passwordRegisterField.value !== rePasswordRegisterField.value) {
		alert('Please re-enter the password!');
		passwordRegisterField.value = valueConstant.null;
		rePasswordRegisterField.value = valueConstant.null;
		return;
	}

	if (!validateEmail(emailInputRegister.value)) {
		alert('Please enter correctly email!');
		emailInputRegister.value = valueConstant.null;
		passwordRegisterField.value = valueConstant.null;
		rePasswordRegisterField.value = valueConstant.null;
		return;
	}

	const userCheck = users.find(
		(user) => user.email === emailInputRegister.value
	);

	if (userCheck) {
		alert('Already have this email registered!');
		emailInputRegister.value = valueConstant.null;
		passwordRegisterField.value = valueConstant.null;
		rePasswordRegisterField.value = valueConstant.null;
		return;
	}

	const newUser = {
		id: generateUID(),
		email: emailInputRegister.value,
		password: passwordRegisterField.value,
	};

	users.push(newUser);
	localStorage.setItem('users', JSON.stringify(users));
	alert('Register success!');
	emailInputRegister.value = valueConstant.null;
	passwordRegisterField.value = valueConstant.null;
	rePasswordRegisterField.value = valueConstant.null;
	registerLink.click();
});

loginForm.addEventListener('submit', function (event) {
	event.preventDefault();

	if (!validateEmail(emailInputLogin.value)) {
		alert('Please enter correctly email!');
		return;
	}
	// check if the user found in database => fetch api in here
	var userCheck = users.find(
		(user) =>
			user.email === emailInputLogin.value &&
			user.password === passwordLoginField.value
	);

	if (userCheck) {
		user = userCheck;
		if (rememberCheck.checked) {
			localStorage.setItem('rememberedUser', JSON.stringify(user));
			sessionStorage.removeItem('currentSessionUser');
		} else {
			sessionStorage.setItem('currentSessionUser', JSON.stringify(user));
			localStorage.removeItem('rememberedUser');
		}
		imageChibi.style.animation = 'chibi-jumping 3s linear 0s 1 normal none';
		setTimeout(function () {
			imageChibi.style.animation = valueConstant.null;
		}, 3100);
		mainForm.style.display = valueConstant.none;
		mainContent.style.display = valueConstant.block;
		passwordLoginField.value = valueConstant.null;
		userTasks = new tasks(user);
		checkUserIsOnline(user);
		userTasks.loadListTasks();
		userTasks.renderListTasks(userTasks.listTasks);
	} else {
		alert('User not found or Email/Password incorrect!');
		emailInputLogin.value = valueConstant.null;
		passwordLoginField.value = valueConstant.null;
		return;
	}
});

window.addEventListener('DOMContentLoaded', function () {
	const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
	const currentSessionUser = JSON.parse(
		sessionStorage.getItem('currentSessionUser')
	);
	if (rememberedUser || currentSessionUser) {
		// display page Login / Signup to none
		mainForm.style.display = valueConstant.none;
		// display toDoApp
		mainContent.style.display = valueConstant.block;
		// loading current user & toDoTask ( when using react => useEffect())
		user = rememberedUser || currentSessionUser;
		users = loadUsers();
		checkUserIsOnline(user);
		userTasks = new tasks(user);
		userTasks.loadListTasks();
		userTasks.renderListTasks(userTasks.listTasks);
	} else {
		users = loadUsers();
		checkUserIsOnline(user);
	}
});

function loadUsers() {}

function checkUserIsOnline(user = valueConstant.null) {}

function tasks(user) {
	this.user = user;
}

tasks.prototype.loadListTasks = function () {};

tasks.prototype.addTask = function (todoValue) {};

tasks.prototype.renderListTasks = function (listTasks) {};

tasks.prototype.editTask = function (id) {};

tasks.prototype.deleteTask = function (id) {};

tasks.prototype.deleteAllTask = function () {};

tasks.prototype.toggleCompleted = function (id) {};

inputTodo.addEventListener('keyup', function () {});

addTodoBtn.addEventListener('click', function () {});

deleteAllBtn.addEventListener('click', function () {});

filterStatus.addEventListener('change', function () {});

logoutBtn.addEventListener('click', function () {});
