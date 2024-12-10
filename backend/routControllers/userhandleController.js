import Conversation from "../Models/conversationModels.js";
import User from "../Models/userModels.js";

export const getUserBySearch = async(req,res) =>{
    try {
        const search = req.query.search || "";
        const currentUserId = req.user._id;

        const user = await User.find({
            $and:[
                {
                    $or:[
                        {username:{$regex:'.*' + search + '.*',$options:'i'}},
                        {fullname:{$regex:'.*' + search + '.*',$options:'i'}}
                    ]
                },{
                    _id:{$ne:currentUserId}
                }
                
            ]
        }).select("-password").select("email")
        res.status(200).send(user)
    } catch (error) {
        console.log("error in getuserbysearch")
        res.status(500).send({
            success:false,
            message:error
        })
    }
}

export const getCurrentChatters = async(req,res) =>{
    try {
        const currentUserId = req.user._id;
        const currentChatter = await Conversation.find({
            participants:currentUserId
        }).sort({
            updatedAt:-1
        });
        if(!currentChatter || currentChatter.length === 0) return res.status(200).send([]);

        const participantsIDS = currentChatter.reduce((ids,conversation)=>{
            const otherParticipants = conversation.participants.filter(id => id.toString() !== currentUserId);
            return [...ids, ...otherParticipants]
        },[]);

        const otherParticipantsIDS = participantsIDS.filter(id => id.toString() !== currentUserId.toString());

        const user = await User.find({_id:{$in:otherParticipantsIDS}}).select("-password").select("-email");

        const users = otherParticipantsIDS.map(id => user.find(user => user._id.toString() === id.toString()));

        res.status(200).send(users)

    } catch (error) {
        console.log("error in getchaters",error)
        res.status(500).send({
            success:false,
            message:error
        })
    }
    
}