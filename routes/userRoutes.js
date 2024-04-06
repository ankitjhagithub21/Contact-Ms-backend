const express = require('express')
const verifyToken = require('../middlewares/verifyToken')
const { addContact, getAllContacts, deleteContact, updateContact } = require('../controllers/userControllers')
const userRouter = express.Router()


userRouter.post("/add-contact",verifyToken,addContact)
userRouter.get("/contacts",verifyToken,getAllContacts)
userRouter.delete("/contacts/delete/:id",verifyToken,deleteContact)
userRouter.put("/contacts/update/:id",verifyToken,updateContact)

module.exports = userRouter