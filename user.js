let users = [];
let messages = {};
let blockedUsers = [];
function joinUser(socketId , userName, roomName) {
const user = {
  socketID :  socketId,
  username : userName,
  roomname : roomName
}
  users.push(user)
return user;
}
function findUser(id) {
  return users.find((user)=>{
    user.id === id;
  })
}

function getAllUsers(){
    return users;
}
function removeUser(id) {
  const getID = users => users.socketID === id;
 const index =  users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
function addMessgaesToRoom(roomId, data){
    if(messages.hasOwnProperty(roomId)){
        messages[roomId].push(data)
    }else{
        messages[roomId]= [data]
    }
    console.log(messages)
}

function blockUser(userId){
    blockedUsers.push(userId)
}
function unblockUser(userId){
    const index =  blockedUsers.findIndex(userId);
    if (index !== -1) {
        return blockedUsers.splice(index, 1)[0];
    }
}

function getAllMeetingMsg(meetingId){
    if(messages[meetingId]){
        return messages[meetingId]
    }else{
        return []
    }
}

function updateMessage(meetinId, message){
    let index = messages[meetinId].findIndex( ( data)=>{
        return data.id === message.id
    })
    messages[meetinId][index]= message;
}

function deleteMessage(meetinId, message){
    let index = messages[meetinId].findIndex( ( data)=>{
        return data.id === message.id
    })
    if (index !== -1) {
        return messages[meetinId].splice(index, 1)[0];
      }
}

function addBlockUser(userId){
    blockUser.push(userId);
}

function getblockedUsers(){
    return blockUser;
}

module.exports ={ joinUser, removeUser,findUser, addMessgaesToRoom, getAllUsers, blockUser, unblockUser,getAllMeetingMsg, updateMessage, deleteMessage, addBlockUser,getblockedUsers}