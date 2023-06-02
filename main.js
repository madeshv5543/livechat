var express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
var http = require('http').createServer(app);
var io = require("socket.io")(http,{cors: {
    origin: '*',
  }});
const {joinUser, removeUser, findUser, addMessgaesToRoom, getAllUsers, getAllMeetingMsg, updateMessage, deleteMessage} = require('./user');
let thisRoom = "";
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
  });
app.get('/users/', function(req,res){
    let users = getAllUsers();
    res.send(users)
})
app.get('/messages/:meeting', function(req,res){
    let meetingId = req.params.meeting;
    let messages = getAllMeetingMsg(meetingId);
    res.send(messages);
})

app.post('/editmessage/:meeting', function (req,res){

    let meetingId = req.params.meeting;;
    let messsageid = req.body.id;
    console.log("update message: " + messsageid)
    updateMessage(meetingId,req.body);
    res.json({success:true,message:req.body});
});

app.post('/deleteMessage/:meeting', function (req,res){
    let meetingId = req.params.meeting;;
    let messsageid = req.body.id;
    deleteMessage(meetingId,req.body);
    res.json({success:true,message:req.body});
})

io.on("connection", function (socket) {
    console.log("connected", socket);
    socket.on("join room", (data) => {
      console.log('in room');
      let Newuser = joinUser(socket.id, data.username,data.roomName)
      //io.to(Newuser.roomname).emit('send data' , {username : Newuser.username,roomname : Newuser.roomname, id : socket.id})
     // io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
     socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname });
     
      thisRoom = Newuser.roomname;
      console.log(Newuser);
      socket.join(Newuser.roomname);
    });
    socket.on("chat message", (data) => {
       addMessgaesToRoom(data.meetingId, data.message)
      io.to(thisRoom).emit("chat message", {data:data,id : socket.id});
    });
    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      console.log(user);
      if(user) {
        console.log(user.username + ' has left');
      }
      console.log("disconnected");
  
    });
  });
  http.listen(3000, function () {});