const express = require('express');
const router = express.Router();
const Post = require(`../models/Post`);
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;
const User = require(`../models/User`);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//CHECK LOGIN
const authMiddleware = (req, res, next) =>{
    const token = req.cookies.token;
if(!token){
    return res.status(401).json({message: `Unauthorized`})
}else{
    try{
        const decoded = jwt.verify(token, jwtSecret); 
        req.userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({message: `Unauthorized Access`})
    }
}
}
//GET
// Admin login page
router.get(`/admin`, async (req,res) =>{
    
    try{
        const locals = {
            title: "Admin",
            description: "Simple Blog created With NodeJs, Express & MongoDB"
        }
        res.render(`admin/index`, { locals, layout: adminLayout})
    }catch(error){
        console.log(error); 
    }
})
//POST
//ADMIN- CHECK LOGIN
router.post(`/admin`, async (req,res) =>{
    
    try{
        const { username, password} = req.body;
        const user = await User.findOne({username});
        if (!user){
            return res.status(401).json({message: `Invalid Credentials`})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: `Invalid Credentials`})
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret);
        res.cookie('token', token, { httponly: true});
        res.redirect('/dashboard')
    }catch(error){
        console.log(error); 
    }
});

//GE
// ADMIN DASHBOARD

//POST
//ADMIN- REGISTER
router.post(`/register`, async (req,res) =>{
    
    try{
        const { username, password} = req.body;
        const hasedPassword = await bcrypt.hash(password, 10);
        try{
            const user = await User.create({ username, password: hasedPassword});
            res.status(201).json({message: 'User Created, user'})
        }catch(error){
            if(error.code === 11000){
                res.status(409).json({message: "User already in use."})
            }
            res.status(500).json({ message: 'Internal server error'})
        }
    }catch(error){
        console.log(error); 
    }
})

// GET
// ADMIN DASHBOARD
router.get('/dashboard', authMiddleware, async(req,res)=>{
    try{
        const locals = {
            title: `Admin Dashboard`,
            description: `Blog Site`
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data
        });
    }catch(error){

    }
})
module.exports = router;