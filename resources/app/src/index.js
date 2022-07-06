const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT;
// const publicDirectoryPath = path.join(__dirname, '../public')

// app.use(express.static(publicDirectoryPath))

var serverState = {
    acceptIncoming: false
}

var name = '';
var vueFuncs;
var vueData;

io.on('connection', (socket) => {
    console.log(serverState.acceptIncoming);
    if (!serverState.acceptIncoming) {
        console.log('cannot accept connections now');
        return socket.emit('deny');
    }
    socket.emit('accept');
    console.log('New WebSocket connection');
    vueFuncs.addPeer({
        peerIp: '',
        peerId: name,
        // _emits_: (event, options) => socket.emit(event, options),
        // _emits_: () => console.log('ok'),
        socketId: `${socket.id}-server`,
    });
    vueData.socketMap.set(`${socket.id}-server`, socket);
    // peerData[name] = {
    //     ip: '',
    //     name: name,
    //     chats: []
    // }

    socket.on('myMessage', (message, callback) => {
        // peerData[options.peerId].chats.unshift({
        //     fromMe: false,
        //     message: options.message
        // });
        const _peerId = Object.keys(vueData.peerData).find(key =>
            vueData.peerData[key].socketId === `${socket.id}-server`
        );
        vueFuncs.addMessage({
            peerId: _peerId,
            message: message,
            fromMe: false
        });
    });

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    // socket.on('sendLocation', (coords, callback) => {
    //     const user = getUser(socket.id)
    //     io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    //     callback()
    // })

    socket.on('disconnect', () => {
        // const user = removeUser(socket.id)

        // if (user) {
        //     io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
        //     io.to(user.room).emit('roomData', {
        //         room: user.room,
        //         users: getUsersInRoom(user.room)
        //     })
        // }
        console.log('socket disconnected')
    })
    serverState.acceptIncoming = false;
    console.log(serverState.acceptIncoming);
})

export function getServerState() {
    return serverState;
}

export function getPeerData() {
    return peerData;
}

export function setVueFuncs(_vueFuncs) {
    vueFuncs = _vueFuncs;
}

export function setVueData(_vueData) {
    vueData = _vueData;
}

export function startSocketListen(listenName) {
    name = listenName
    console.log(serverState.acceptIncoming);
    serverState.acceptIncoming = true;
    console.log('Server is now listening');
}

export function stopSocketListen() {
    console.log(serverState.acceptIncoming);
    serverState.acceptIncoming = false;
    console.log('Server has stopped listening');
}

export function startServer(socketPort) {
    if (!server.listening) {
        server.listen(socketPort, () => {
            console.log(`Server is up on port ${socketPort}!`)
        })
    }
}