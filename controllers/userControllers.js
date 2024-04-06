const Contact = require("../models/contact");
const User = require("../models/user");

const addContact = async(req,res) =>{
    try{
        const {name,email,phone,address} = req.body;
        if(!name || !email || !phone || !address){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const userId = req.id;
        const user = await User.findById(userId)

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found."
            })
        }
        const newContact = new Contact({
            name,
            email,
            phone,
            address,
            userId:user._id
        })
        await newContact.save()

        res.status(201).json({
            success:true,
            message:"Contact created successfully."
        })
    
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getAllContacts = async(req,res) =>{
    try{
        const userId = req.id;
        const contacts = await Contact.find({userId})
        if(!contacts){
            return res.status(404).json({
                success:false,
                message:"No contact found."
            })
        }
        res.status(200).json({
            success:true,
            message:"Contact found.",
            contacts
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteContact = async (req, res) => {
    try {
        const userId = req.id;
        const contactId = req.params.id;

        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found."
            });
        }

        if (contact.userId != userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete this contact."
            });
        }

        // Delete the contact
        await Contact.deleteOne({_id: contactId});

        res.status(200).json({
            success: true,
            message: "Contact deleted."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const updateContact = async (req, res) => {
    try {
        const userId = req.id;
        const contactId = req.params.id;
        const { name, email, phone, address } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const contact = await Contact.findById(contactId);

        // Check if contact exists
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found."
            });
        }

        // Check if the requesting user is authorized to update this contact
        if (contact.userId != userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this contact."
            });
        }

        // Update the contact
        await Contact.findByIdAndUpdate(contactId, {
            name,
            email,
            phone,
            address
        });

        res.status(200).json({
            success: true,
            message: "Contact updated successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



module.exports = {
    addContact,
    getAllContacts,
    deleteContact,
    updateContact
}