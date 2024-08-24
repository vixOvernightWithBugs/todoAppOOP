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
		alert(
			'Please enter a valid email address. Email must be in the format name@domain.com.'
		);
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
	users = loadUsers();
	if (rememberedUser || currentSessionUser) {
		// display page Login / Signup to none
		mainForm.style.display = valueConstant.none;
		// display toDoApp
		mainContent.style.display = valueConstant.block;
		// loading current user & toDoTask ( when using react => useEffect())
		user = rememberedUser || currentSessionUser;
		checkUserIsOnline(user);
		userTasks = new tasks(user);
		userTasks.loadListTasks();
		userTasks.renderListTasks(userTasks.listTasks);
	} else {
		checkUserIsOnline(user);
	}
});

function loadUsers() {
	var users = JSON.parse(localStorage.getItem('users') || '[]');
	return users;
}

function checkUserIsOnline(user = valueConstant.null) {
	if (user) {
		notificationUser.style.display = valueConstant.flex;
		logoutButton.classList.add(valueConstant.active);
		userActive.innerHTML = user?.email;
	} else {
		notificationUser.style.display = valueConstant.none;
		logoutButton.classList.remove(valueConstant.active);
		userActive.innerHTML = valueConstant.null;
	}
}

function tasks(user) {
	this.user = user;
}

tasks.prototype.loadListTasks = function () {
	var listTasks = JSON.parse(localStorage.getItem('listTasks') || '[]');
	this.listTasks = listTasks;
};

tasks.prototype.addTask = function (todoValue) {
	var newTask = {
		id: generateUID(),
		name: todoValue,
		user_id: user.id,
		completed: filterState.UNDONE,
	};
	this.listTasks.unshift(newTask);
	localStorage.setItem('listTasks', JSON.stringify(this.listTasks));
	addTodoButton.classList.remove(valueConstant.active);
	imageChibi.style.animation = 'chibi-swinging 3s linear 0s 1 normal none';
	setTimeout(function () {
		imageChibi.style.animation = valueConstant.null;
	}, 3100);
	this.loadListTasks();
	this.renderListTasks(this.listTasks);
};

tasks.prototype.renderListTasks = function (listTasks) {
	if (listTasks) {
		var tasks = listTasks.filter((task) => task.user_id === user.id);
	}
	pendingTasksCount.textContent = tasks?.length || 0;
	if (tasks?.length > 0) {
		todoList.innerHTML = tasks
			.map((item) => {
				return `<li>
			<div class="id-${item.id}">
			  <input onchange="userTasks.toggleCompleted('${item.id}')" 
			  type="checkbox" ${
					item.completed === filterState.DONE ? 'checked' : valueConstant.null
				}>
			  <p>${item.name}</p>
			  <span class ="icon icon-edit" onclick="userTasks.editTask('${item.id}') ">
				<i class="fa-solid fa-pen-to-square"></i>
			  </span>
			  <span class="icon" onclick="userTasks.deleteTask('${item.id}')">
				<i class="fas fa-trash"></i>
			  </span>
			</div>
		  </li>`;
			})
			.join(valueConstant.null);
		deleteAllTasksButton.classList.add(valueConstant.active);
	} else {
		todoList.innerHTML = `Nothing to show here. Please add task`;
		deleteAllTasksButton.classList.remove(valueConstant.active);
	}
};

tasks.prototype.editTask = function (id) {
	const todoItem = $(`.id-${id}`);
	const task = this.listTasks.find((task) => task.id === id);
	if (task) {
		const existingValue = task.name;
		const inputElement = document.createElement('input');
		inputElement.value = existingValue;
		todoItem.replaceWith(inputElement);
		inputElement.focus();

		const that = this;
		inputElement.addEventListener('blur', function () {
			const updatedValue = inputElement.value.trim();
			if (updatedValue) {
				const taskCheck = that.listTasks.find((task) => task.id === id);
				taskCheck.name = updatedValue;
				localStorage.setItem('listTasks', JSON.stringify(that.listTasks));
				that.loadListTasks();
				that.renderListTasks(that.listTasks);
			}
		});
	}
};

tasks.prototype.deleteTask = function (id) {
	const updateListTasks = this.listTasks.filter((task) => task.id !== id);
	if (updateListTasks) {
		localStorage.setItem('listTasks', JSON.stringify(updateListTasks));
		this.loadListTasks();
		this.renderListTasks(this.listTasks);
	}
};

tasks.prototype.deleteAllTask = function () {
	if (confirm('Delete All?')) {
		var updatedListTasks = this.listTasks.filter(
			(task) => task.user_id !== user.id
		);
		if (updatedListTasks) {
			imageChibi.style.animation = 'chibi-angrying 1s linear 0s 1 normal none';
			setTimeout(function () {
				imageChibi.style.animation = valueConstant.null;
			}, 3100);
			localStorage.setItem('listTasks', JSON.stringify(updatedListTasks));
			this.loadListTasks();
			this.renderListTasks(this.listTasks);
		}
	}
};

tasks.prototype.toggleCompleted = function (id) {
	const task = this.listTasks.find((task) => task.id === id);
	if (task) {
		if (task.completed === filterState.UNDONE) {
			task.completed = filterState.DONE;
			this.listTasks.splice(this.listTasks.indexOf(task), 1);
			this.listTasks.push(task);
		} else if (task.completed === filterState.DONE) {
			task.completed = filterState.UNDONE;
			this.listTasks.splice(this.listTasks.indexOf(task), 1);
			this.listTasks.unshift(task);
		}
		localStorage.setItem('listTasks', JSON.stringify(this.listTasks));
		this.loadListTasks();
		filterStatus.value = filterState.ALL;
		filterStatus.dispatchEvent(new Event('change'));
	}
};

inputTodo.addEventListener('keyup', function () {
	let enteredValues = inputTodo.value.trim();
	if (enteredValues) {
		addTodoButton.classList.add(valueConstant.active);
	} else {
		addTodoButton.classList.remove(valueConstant.active);
	}
});

addTodoButton.addEventListener('click', function () {
	let todoValue = inputTodo.value.trim();
	userTasks.addTask(todoValue);
	inputTodo.value = valueConstant.null;
});

deleteAllTasksButton.addEventListener('click', function () {
	userTasks.deleteAllTask();
});

filterStatus.addEventListener('change', function () {
	const filterStatusValue = filterStatus.value;
	if (filterStatusValue === filterState.DONE) {
		userTasks.renderListTasks(
			userTasks.listTasks.filter((task) => task.completed === filterState.DONE)
		);
	} else if (filterStatusValue === filterState.UNDONE) {
		userTasks.renderListTasks(
			userTasks.listTasks.filter(
				(task) => task.completed === filterState.UNDONE
			)
		);
	} else {
		userTasks.renderListTasks(userTasks.listTasks);
	}
});

logoutButton.addEventListener('click', function () {
	localStorage.removeItem('rememberedUser');
	sessionStorage.removeItem('currentSessionUser');
	userTasks = valueConstant.null;
	checkUserIsOnline();
	mainForm.style.display = valueConstant.flex;
	mainContent.style.display = valueConstant.none;
});
