
const jwt = require('jsonwebtoken')

 const adminAuth = (req, res, next) =>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return resizeBy.status(401).json({message : "NO TOKEN PROVIDED!"});

    try{
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "admin"){
            return res.status(403).json({message : "ACCESS DENIED : ADMINS ONLY!"})
        }
    }
    catch(err){
        res.status(401).json({message: 'INVALID TOKEN!'})
    }
}

module.exports = {adminAuth}