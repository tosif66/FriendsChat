import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:['http://localhost:5173','https://friendschatapp.onrender.com'],
        methods:["GET","POST"]
    }
});

export const getReceiverSocketId = (receiverId) =>{
    return userSocketmap[receiverId] || null ;
}

const userSocketmap = {} //{userId,socketId}

io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

if (userId) {
    userSocketmap[userId] = socket.id;

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketmap));

    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
} else {
    console.error("Connection attempt with undefined userId");
}

socket.on('disconnect', () => {
    if (userId) {
        delete userSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketmap));

        console.log(`User disconnected: ${userId}`);
    }
});
});

export {app , io, server}