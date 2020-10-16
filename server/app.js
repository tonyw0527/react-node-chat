const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3001;

let chatUsersNumber = 0;
let currentUsers = [];

io.on('connection', (socket) => {

    socket.on('login', (nickname) => {
        currentUsers.push({ id: socket.client.id, userName: nickname });

        chatUsersNumber++;
        io.emit('new user', {nickname, chatUsersNumber, currentUsers});
    });

    const { id } = socket.client;
    // console.log(`new user connected. - id: ${id}`);

    socket.on('send msg', ({name, msg}) => {
        // console.log(`msg received - name: ${name}, msg: ${msg}`);

        io.emit('send msg', {name, msg});
    });

    socket.on('disconnect', () => {
        // console.log(`a user disconnected. - id: ${id}`);
        const index = currentUsers.findIndex(item => item.id === socket.client.id);
        const exitedUserName = currentUsers[index].userName;
        currentUsers.splice(index, 1);
        chatUsersNumber--;
        io.emit('user exit', { exitedUserName, chatUsersNumber, currentUsers });

    })
});


http.listen(PORT, () => {
    console.log(`Chat2 server is running on ${PORT}`);
});