import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReceiverSocketId, io, } from "../Socket/socket.js";

export const sendMessage = async(req,res) =>{
try {
    // here use messages instead of message
    const {message} = req.body;
    const {id:receiverId} = req.params;
    const senderId = req.user._id;

    let chats = await Conversation.findOne({
        participants : {$all:[senderId,receiverId]}
    })
    if(!chats){
        chats = await Conversation.create({
            participants : [senderId,receiverId],
            messages:[]
        });
    }

    // use message instead of message
    const newMessages = new Message({
        senderId,
        receiverId,
        message,
        conversationId:chats._id
    });


    chats.messages.push(newMessages._id)
    
    await Promise.all([chats.save(),newMessages.save()]);
    
    //Socket io ka code

    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessages)
    }

    res.status(201).send(newMessages);
    return;
} catch (error) {
    res.status(500).send({
        success: false,
        message: error.message || "Failed to send message"
    });
    console.error("Error in sendMessage:", error);
}
}

export const getMessages = async(req,res) =>{
    try {
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        const chats = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages");

        if(!chats){
            return res.status(200).send([]);
        }
        res.status(200).send(chats.messages || []);

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message || "Server Error"
        })
        console.log("error in getMessages",error);
    }
}