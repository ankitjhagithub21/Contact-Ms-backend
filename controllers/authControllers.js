const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const register = async(req,res) =>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist."
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            success:true,
            message:"Account Created."
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const login = async(req,res) =>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const existingUser = await User.findOne({email})

        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"Wrong email or password!"
            })
        }

        const comparePassword = await bcrypt.compare(password,existingUser.password)

        if(!comparePassword){
            return res.status(400).json({
                success:false,
                message:"Wrong email or password!"
            })
        }

        const token = jwt.sign({id:existingUser._id},process.env.JWT_SECRET,{expiresIn:"1h"})

        res.cookie('jwt',token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            expires:new Date(Date.now()+3600000) //1 hour       
        })

        res.status(200).json({
            success:true,
            message:"Login Successfull."
        })




    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getUser = async(req,res)=>{
    try{
        const userId = req.id;
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found."
            })
        }
        res.status(200).json({
            success:true,
            message:"User found.",
            user
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const logout = async(req,res) =>{
    try{
        
        
        res.clearCookie('jwt',{
            expires:new Date(0)
        });

        res.status(200).json({
            success: true,
            message: 'Logout successfull'
        });
        




    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    register,
    login,
    getUser,
    logout
}