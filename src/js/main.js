let registerBox = document.querySelector(".register-box");
let loginBox = document.querySelector(".login-box");

let registerUsername = document.querySelector("#register-username");
let registerPassword = document.querySelector("#register-password");
let registerBtn = document.querySelector("#register-submit-btn");

let goToRegister = document.querySelector("#go-to-register-page");
let goToLogin = document.querySelector("#go-to-login-page");

let loginUsername = document.querySelector("#login-username");
let loginPassword = document.querySelector("#login-user-password");
let loginBtn = document.querySelector("#login-user-submit-btn");

let logoutBtn = document.querySelector("#header-logout-btn");
let appContainer = document.querySelector("#app-container");
let onlineWrapper = document.querySelector(".online__wrapper");
let onlineCounter = document.querySelector(".online__counter_placeholder");

registerBtn.addEventListener("click", registerUser);
loginBtn.addEventListener("click", loginUser);
logoutBtn.addEventListener("click", logOut);
goToRegister.addEventListener("click", switchToRegisterPage);
goToLogin.addEventListener("click", switchToLoginPage);

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    if (localStorage.getItem("logged-in")) {
        switchToMessages(event);
    }
});

function switchToRegisterPage(event) {
    event.preventDefault();
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
    appContainer.classList.add("hidden");
}

function switchToLoginPage(event) {
    event.preventDefault();
    loginBox.classList.remove("hidden");
    registerBox.classList.add("hidden");
    appContainer.classList.add("hidden");
}

function switchToMessages(event) {
    event.preventDefault();
    loginBox.classList.add("hidden");
    registerBox.classList.add("hidden");
    appContainer.classList.remove("hidden");
    getUsersFromServer(event);
}

function loginUser(event) {
    event.preventDefault();
    let userName = loginUsername.value;
    let passWord = loginPassword.value;

    if (!isValid(userName) || !isValid(passWord)) {
        console.error("Username or password is not valid... Try again");
        return;
    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "https://studentschat.herokuapp.com/users/login");
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({username: userName, password: passWord}));

    xhr.onload = () => {
        console.log(xhr.response);
        switchToMessages(event);
    }
}

function registerUser(event) {
    event.preventDefault();
    let userName = registerUsername.value;
    let passWord = registerPassword.value;

    console.log(userName);
    console.log(passWord);

    if (!isValid(userName) || !isValid(passWord)) {
        console.log("Username or password is not valid... Try again");
        return;
    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "https://studentschat.herokuapp.com/users/register");
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({username: userName, password: passWord}));

    xhr.onload = () => {
        console.log(xhr.response);
        switchToLoginPage(event);
    }
}

function logOut(event) {
    event.preventDefault();
    setLoggedInLocalStorage(false);
    switchToLoginPage(event);
}

function isValid(text) {
    return text.length > 5;
}

function getUsersFromServer(event) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://studentschat.herokuapp.com/users/');

    xhr.send();

    xhr.onload = function () {
        if (xhr.status !== 200) {
            console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        } else {
            console.log(`Well done, received ${xhr.response.length} bytes`);
            console.log(JSON.parse(xhr.responseText));
            const users = JSON.parse(xhr.responseText).map(user => new Object({ username: user.username, status: user.status}));
            clearOnlineWrapper(onlineWrapper);
            console.log("users:", users);
            displayUsers(users);
        }
    };

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            console.log(`Received ${event.loaded} from ${event.total} bytes`);
        } else {
            console.log(`Received ${event.loaded} bytes`);
        }
        onlineWrapper.innerHTML = "Receiving users...";
    };

    xhr.onerror = function () {
        console.log("Request gone bad...");
        onlineWrapper.innerHTML = "Users not found...";
    };
}

function displayUsers(users = []) {
    clearOnlineWrapper(onlineWrapper);
    if (users.length > 0) {
        users.forEach(user => {
            let newUser = document.createElement("a");
            newUser.classList.add("online__person");
            newUser.innerText = user.username;
            if (user.status === "active") {
                newUser.classList.add("active");
            }
            onlineWrapper.appendChild(newUser);
        });
    } else {
        onlineWrapper.innerHTML = `No users...`;
    }
}

function clearOnlineWrapper(e) {
    e.innerHTML = "";
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

function setLoggedInLocalStorage(isLoggedin = true) {
    if (!isLoggedin) {
        localStorage.setItem('logged-in', 'false');
    } else {
        localStorage.setItem('logged-in', 'true');
    }
}
