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
	if (registerForm.style.display !== valueConstant.NONE) {
		registerForm.style.display = valueConstant.NONE;
		askUserRegister.style.display = valueConstant.NONE;
		loginForm.style.display = valueConstant.FLEX;
		askUserLogin.style.display = valueConstant.FLEX;
	} else {
		loginForm.style.display = valueConstant.NONE;
		askUserLogin.style.display = valueConstant.NONE;
		registerForm.style.display = valueConstant.FLEX;
		askUserRegister.style.display = valueConstant.FLEX;
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
		passwordRegisterField.value = valueConstant.NULL;
		rePasswordRegisterField.value = valueConstant.NULL;
		return;
	}

	if (!validateEmail(emailInputRegister.value)) {
		alert(
			'Please enter a valid email address. Email must be in the format name@domain.com.'
		);
		emailInputRegister.value = valueConstant.NULL;
		passwordRegisterField.value = valueConstant.NULL;
		rePasswordRegisterField.value = valueConstant.NULL;
		return;
	}

	const userCheck = users.find(
		(user) => user.email === emailInputRegister.value
	);

	if (userCheck) {
		alert('Already have this email registered!');
		emailInputRegister.value = valueConstant.NULL;
		passwordRegisterField.value = valueConstant.NULL;
		rePasswordRegisterField.value = valueConstant.NULL;
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
	emailInputRegister.value = valueConstant.NULL;
	passwordRegisterField.value = valueConstant.NULL;
	rePasswordRegisterField.value = valueConstant.NULL;
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
			imageChibi.style.animation = valueConstant.NULL;
		}, 3100);
		mainForm.style.display = valueConstant.NONE;
		mainContent.style.display = valueConstant.BLOCK;
		passwordLoginField.value = valueConstant.NULL;
		userTasks = new tasks(user);
		checkUserIsOnline(user);
		userTasks.loadListTasks();
		userTasks.renderListTasks(userTasks.listTasks);
	} else {
		alert('User not found or Email/Password incorrect!');
		emailInputLogin.value = valueConstant.NULL;
		passwordLoginField.value = valueConstant.NULL;
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
		mainForm.style.display = valueConstant.NONE;
		// display toDoApp
		mainContent.style.display = valueConstant.BLOCK;
		// loading current user & toDoTask ( when using react => useEffect())
		user = rememberedUser || currentSessionUser;
		checkUserIsOnline(user);
		userTasks = new userTasksManager(user);
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

function checkUserIsOnline(user = valueConstant.NULL) {
	if (user) {
		notificationUser.style.display = valueConstant.FLEX;
		logoutButton.classList.add(valueConstant.ACTIVE);
		userActive.innerHTML = user?.email;
	} else {
		notificationUser.style.display = valueConstant.NONE;
		logoutButton.classList.remove(valueConstant.ACTIVE);
		userActive.innerHTML = valueConstant.NULL;
	}
}

class userTasksManager {
	constructor(user) {
		this.user = user
	}
}

userTasksManager.prototype.loadListTasks = function () {
	var listTasks = JSON.parse(localStorage.getItem('listTasks') || '[]');
	this.listTasks = listTasks;
};

userTasksManager.prototype.addTask = function (todoValue) {
	var newTask = {
		id: generateUID(),
		name: todoValue,
		user_id: user.id,
		completed: filterState.UNDONE,
	};
	this.listTasks.unshift(newTask);
	localStorage.setItem('listTasks', JSON.stringify(this.listTasks));
	addTodoButton.classList.remove(valueConstant.ACTIVE);
	imageChibi.style.animation = 'chibi-swinging 3s linear 0s 1 normal none';
	setTimeout(function () {
		imageChibi.style.animation = valueConstant.NULL;
	}, 3100);
	this.loadListTasks();
	this.renderListTasks(this.listTasks);
};

userTasksManager.prototype.renderListTasks = function (listTasks) {
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
					item.completed === filterState.DONE ? 'checked' : valueConstant.NULL
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
			.join(valueConstant.NULL);
		deleteAllTasksButton.classList.add(valueConstant.ACTIVE);
	} else {
		todoList.innerHTML = `Nothing to show here. Please add task`;
		deleteAllTasksButton.classList.remove(valueConstant.ACTIVE);
	}
};

userTasksManager.prototype.editTask = function (id) {
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

userTasksManager.prototype.deleteTask = function (id) {
	const updateListTasks = this.listTasks.filter((task) => task.id !== id);
	if (updateListTasks) {
		localStorage.setItem('listTasks', JSON.stringify(updateListTasks));
		this.loadListTasks();
		this.renderListTasks(this.listTasks);
	}
};

userTasksManager.prototype.deleteAllTask = function () {
	if (confirm('Delete All?')) {
		var updatedListTasks = this.listTasks.filter(
			(task) => task.user_id !== user.id
		);
		if (updatedListTasks) {
			imageChibi.style.animation = 'chibi-angrying 1s linear 0s 1 normal none';
			setTimeout(function () {
				imageChibi.style.animation = valueConstant.NULL;
			}, 3100);
			localStorage.setItem('listTasks', JSON.stringify(updatedListTasks));
			this.loadListTasks();
			this.renderListTasks(this.listTasks);
		}
	}
};

userTasksManager.prototype.toggleCompleted = function (id) {
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
		addTodoButton.classList.add(valueConstant.ACTIVE);
	} else {
		addTodoButton.classList.remove(valueConstant.ACTIVE);
	}
});

addTodoButton.addEventListener('click', function () {
	let todoValue = inputTodo.value.trim();
	userTasks.addTask(todoValue);
	inputTodo.value = valueConstant.NULL;
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
	userTasks = valueConstant.NULL;
	checkUserIsOnline();
	mainForm.style.display = valueConstant.FLEX;
	mainContent.style.display = valueConstant.NONE;
});
