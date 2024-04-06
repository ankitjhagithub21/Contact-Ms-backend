const express = require('express')
const { register, login, getUser, logout } = require('../controllers/authControllers')
const verifyToken = require('../middlewares/verifyToken')
const authRouter = express.Router()

authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.get("/logout",logout)
authRouter.get("/user",verifyToken,getUser)


module.exports = authRouter