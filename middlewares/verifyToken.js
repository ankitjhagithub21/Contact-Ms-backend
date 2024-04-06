const jwt = require('jsonwebtoken')

const verifyToken = async(req,res,next) =>{
    try{
        const authToken = req.cookies.jwt;
        if(!authToken){
            return res.status(401).json({
                success:false,
                message:"Missing token."
            })
        }
        const userData = jwt.verify(authToken,process.env.JWT_SECRET)
        if(!userData){
            return res.status(401).json({
                success:false,
                message:"Invalid token."
            })
        }
        req.id = userData.id;
        next()

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = verifyToken