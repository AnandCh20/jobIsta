const express = require('express');
const router = express.Router(); //Bunch of routes or set of routes 
const User = require('../schema/user.schema')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
router.get('/', (req, res)=>{
    throw new Error("Forced Error");
    res.send("Login Page....")
});
router.post('/register', async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        const userExists = await User.findOne({ email })
        if(userExists){
            res.status(400).send({message: 'User already exists'})
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({
            name, 
            email, 
            password: hash
        });
        await user.save();
        const token = jwt.sign({_id:user._id}, process.env.JWT_PRIVATE_KEY);
        res.json({
            email: user.email,
            token
        })
        
    }catch(err){
        return new Error(err.message)
    }
})

router.post('/login', async (req, res)=>{
    try{
        const { email, password} = req.body;
        const userExists = await User.findOne({ email })
        // console.log(userExists)
        if(!userExists){
            res.status(400).send({message: 'User doesnt exists'})
        }
        const valPassword = bcrypt.compareSync(password, userExists.password);
        if(!valPassword){
            res.status(400).send({message: 'Invalid Password'})
        }
        const token = jwt.sign({_id:userExists._id}, process.env.JWT_PRIVATE_KEY);
        res.json({
            email: userExists.email,
            token
        })
        
    }catch(err){
        return new Error(err.message)
    }
})

router.post('/updatepassword', async (req, res)=>{
    try{
        // We took the password and newPassword from the body
        const { email, password, newPassword} = req.body;
        const token = req.headers['authorization'];
        // console.log(token)
        const userExists = await User.findOne({ email });
        // console.log(userExists)
        if(!userExists){
            res.status(400).send({message: 'User doesnt exists'})
        }
        const valPassword = bcrypt.compareSync(password, userExists.password);
        if(!valPassword){
            res.status(400).send({message: 'Invalid Password'})
        }
        const verifiedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        const userExistsToken = userExists._id.toString();
        // console.log(verifiedToken._id)
        // console.log(userExistsToken)
        if(verifiedToken._id !== userExistsToken){
            res.status(400).send({message: 'Invalid Token'})
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);
        await User.findOneAndUpdate(
            {email: userExists.email},
            {password: hash}
        )       
        res.json({message: 'Password Updated Successfully'})
    }catch(err){
        return new Error(err.message)
    }
})

module.exports = router;