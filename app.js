const express = require("express");
const app = express();
const PORT = 4000;
const server = require("http").Server(app);
const io = require("socket.io")(server);
app.use(express.static(__dirname + "/publick"));

let users = [];
let usersList = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
    usersList.push(socket);
  console.log("Users===>", usersList.length);

  socket.on("login", data => {
    console.log(data);
    const found = users.find(nickname => {
      return nickname === data;
    });
    if(!found){
        users.push(data);
        socket.nickname = data;
        io.sockets.emit('login', {status: 'OK'});
        console.log('my list:',users);
        io.sockets.emit('users', {users});
      }else{
        io.sockets.emit('login', {status: 'FAILED'});
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
      io.sockets.emit('users', {users});
    });
});



server.listen(PORT, () => {
  console.log("Server worked");
});
