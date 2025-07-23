
function errorHandler(error,req,res,next) {
    console.error("Global Error:", error)
    if (error.name === 'Unauthorized') {
        return res.status(401).json({message: error.message})
    }
    
    if (error.name === 'BadRequest') {
        return res.status(400).json({message: error.message})
    }

    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map(el => el.message)
        return res.status(400).json({message:errors})
        
    }
    if (error.name ==="Forbidden") {
        return res.status(403).json({message: error.message})
    }
    if (error.name === "NotFound") {
        return res.status(404).json({message: error.message})
    }

    if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({ message: "Invalid token" })
    }
    if (error.name === 'GoogleTokenError') {
      // Handle specific Google token errors
      if (error.message.includes("No pem found for envelop")) {
        return res.status(401).json({ message: "Invalid google token"})
      } else {
        return res.status(500).json({ message: 'Internal server error' });
      }
    }       
    
    return res.status(500).json({message: 'Internal Server Error'})
}

module.exports = errorHandler