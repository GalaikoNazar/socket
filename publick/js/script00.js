const socket = io.connect();
const nickname = document.querySelector("#nickname");
const loginForm = document.querySelector(".login-form");
let begin = false;

function showPanel(data) {
  if (data.status === "OK") {
    document.querySelector(".login-form").classList.add("d-none");
    document
      .querySelector(".message-form-container")
      .classList.remove("d-none");
    document.querySelector(".users-list").classList.remove("d-none");
  } else {
    document.querySelector(".login-form").classList.remove("d-none");
    document.querySelector(".message-form-container").classList.add("d-none");
    document.querySelector(".users-list").classList.add("d-none");
  }
  if (data == "show") {
    document.querySelector(".login-form").classList.add("d-none");
    document
      .querySelector(".message-form-container")
      .classList.remove("d-none");
    document.querySelector(".users-list").classList.remove("d-none");
  }
  if (data == "off") {
    document.querySelector(".login-form").classList.remove("d-none");
    document.querySelector(".message-form-container").classList.add("d-none");
    document.querySelector(".users-list").classList.add("d-none");
  }
}

function auth() {
  if (localStorage.getItem("nickname")) {
    let nickname = localStorage.getItem("nickname");
    socket.emit("login", nickname);
    begin = true;
  }
}
auth();

function logout() {
  localStorage.removeItem("nickname");
  begin = false;
  showPanel("off");
}

loginForm.addEventListener("submit", item => {
  item.preventDefault();
  socket.emit("login", nickname.value);
  localStorage.setItem("nickname", nickname.value);
  begin = true;
});

document.querySelector(".message-form").addEventListener("submit", item => {
  item.preventDefault();
  let text = item.target.querySelector("input").value;
  socket.emit("message", text);
  item.target.querySelector("input").value = "";
});

//listener

socket.on("login", data => {
  console.log("data", data);
  if (begin === true) {
    showPanel(data);
  } else {
    document.querySelector(".login-form").classList.remove("d-none");
    document.querySelector(".message-form-container").classList.add("d-none");
    document.querySelector(".users-list").classList.add("d-none");
  }
});

socket.on("new message", data => {
  console.log('====>',data);
  let newMess = document.createElement("div");
  newMess.className = "list-group-item list-group-item-action";
  let textMessage = `<div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${data.nickname}</h5>
        <small class="text-muted">${new Date(
          data.time
        ).toLocaleString()}</small>
    </div>
    <p class="mb-1">${data.message}</p>`;
  newMess.innerHTML = textMessage;
  document.querySelector(".messages-list .list-group").append(newMess);
});

socket.on("users", data => {
  console.log(data.users);
  let li = "";
  data.users.forEach(item => {
    return (li += `<li class="">${item}</li>`);
  });
  document.querySelector(".users-list .list-group").innerHTML = li;
});
