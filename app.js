const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;
const server = require("http").Server(app);
const io = require("socket.io")(server);
app.use(express.static(__dirname + "/publick"));

const mysql = require("mysql2");

let router = require("./Dashboard/dashboard");
let users = [];
let usersList = [];


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/", router.rout);



io.on("connection", socket => {
  usersList.push(socket);
  console.log("Users===>", usersList.length);

  socket.on("login", data => {
    const found = users.find(nickname => {
      return nickname === data;
    });
    if (!found) {
      users.push(data);
      socket.nickname = data;
      io.sockets.emit("login", { status: "OK" });
      io.sockets.emit("users", { users });
    } else {
      io.sockets.emit("login", { status: "FAILED" });
    }
  });

  socket.on("message", data => {
    io.sockets.emit("new message", {
      message: data,
      nickname: socket.nickname,
      time: new Date()
    });
  });

  socket.on("disconnect", data => {
    for (let index = 0; index < users.length; index++) {
      if (users[index] === socket.nickname) {
        users.splice(index, 1);
      }
    }
    io.sockets.emit("users", { users });
  });
});



//mySQL
const connection = mysql.createConnection({
  host: "uagn.mysql.tools",
  user: "uagn_test1",
  database: "uagn_test1",
  password: "nwzk4d5j"
});

connection.connect(function(err){
  if (err) {
    return console.error("Ошибка: " + err.message);
  }
  else{
    console.log("Подключение к серверу MySQL успешно установлено");
  }
});

connection.query("SELECT * FROM tasks",
  function(error, rows, fields) {
    console.log(rows); // собственно данные
});
connection.end();



server.listen(PORT, () => {
  console.log("Server working");
});
