import bcryptjs from "bcryptjs";
import User from "../Models/userModels.js";
import jwtToken from "../utils/jwtwebToken.js";


export const userRegister =async(req,res) =>{
    try {
        const {fullname,username,email,gender,password,profilepic} = req.body;
        const user = await User.findOne({username,email});
        if(user) return res.status(500).send({success:false,message:"Username or Email is already exist..try another one"});
        const hashPassword = bcryptjs.hashSync(password,10);
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password:hashPassword,
            gender,
            profilepic:gender === "male" ? profileBoy : profileGirl
        });

        if (newUser){
            await newUser.save();
            jwtToken(newUser._id,res)
        }else{
            res.status(500).send({success:false,message:"Invalid user data"})
        }

        res.status(201).send({
            _id : newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilepic:newUser.profilepic,
            email:newUser.email

        })

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
        
    }
}

export const userLogin = async(req,res) =>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if (!user) return res.status(500).send({success:false,message:"Email doesn't exist..Please Register"})
        const comparePass = bcryptjs.compareSync(password,user.password || "wrong password")
        if (!comparePass) return res.status(500).send({success:false,message:"Email and Password dosen't match"})
    
        jwtToken(user._id,res)
        res.status(200).send({
            _id : user._id,
            fullname:user.fullname,
            username:user.username,
            profilepic:user.profilepic,
            email:user.email,
            message:`${user.username} Login Successfully!`
        })

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
        
    }
}

export const userLogOut = async(req,res) =>{
try {
    res.cookie("jwt",'',{
        maxAge:0
    })
    res.status(200).send({message:`user log out successfully`})
} catch (error) {
    res.status(500).send({
        success:false,
        message:error
    })
    console.log(error);
}
}