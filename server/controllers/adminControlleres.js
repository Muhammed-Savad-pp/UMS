import { parse } from "dotenv";
import User from "../models/user-modele.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs'

export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "successfully Login",
        token: token,
      });
    } else {
      return next(errorHandler(401, "Wrong Credential"));
    }
  } catch (error) {}
};

export const getUserDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments({});

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"an error occured while fetching user datas"
    })
    console.log(error.message);
    
  }
};


export const getUserEdit = async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId);
    
    if(!user){
      return res.status(404).json({success:false, message:"User not found"})
    }

    res.status(200).json({
      success:true,
      user:{
        userName: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      }
    })



  } catch (error) {
    console.log(error.message);
    res.status(500).json({success:false, message:"server issue"})
    
  }
}

export const updateUser = async (req, res) => {
  try {
    const { userName, email, profilePicture } = req.body; 
    const { userId } = req.params;

   

    const existinUserWithEmail = await User.findOne({email});

    if(existinUserWithEmail && existinUserWithEmail._id.toString() !== userId){
      return res.json({
        success:false,
        message:'email already use'
      })
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        username: userName,
        email:email,
        profilePicture:profilePicture
      },
      {new: true}
    )

    if(updateUser){
      res.status(200).json({
        success:true,
        message:'profile Update succesfully',
        user:updateUser
      })
    }else{
      res.status(404).json({
        success:false,
        message:'user not found'
      })
    }  
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    
    const {userId} = req.params;
    const deleteUser = await User.findByIdAndDelete(userId)

    if(!deleteUser){
      res.status(404).json({success:false, message:'user not delete'})
    }

    res.json({success:true, message:'User deleted Successfully'})
    
  } catch (error) {
    console.log(error);
    
  }
}

export const createuser = async (req, res) => {
  const {username, email, password} = req.body;
  

  const hashPassword = bcryptjs.hashSync(password, 10);
  try {
    
    const newUser = new User ({
      username:username,
      email:email,
      password:hashPassword,
    })

    const saveuser = await newUser.save();
    if(saveuser) {
      res.status(201).json({success:true, message:'user created successfully'});
    }else{
      res.json({success:false, message:'user not created'})
    }
  

  } catch (error) {
    console.log(error);
    
  }
}