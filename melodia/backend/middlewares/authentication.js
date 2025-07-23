const {User} = require('../models')
const { verifyToken } = require("../helpers/jwt")

async function authentication(req,res,next) {
    try {
        const { authorization } = req.headers

        if (!authorization) {
        throw { name: "Unauthorized", message: "Invalid token" }
        }

        const rawToken = authorization.split(' ')
        const tokenType = rawToken[0] 
        const tokenValue = rawToken[1]

        if (tokenType !== 'Bearer' || !tokenValue) {
          throw { name: "Unauthorized", message: "Invalid token" }
        }

        const result = verifyToken(tokenValue)

        const user = await User.findByPk(result.id)
        if (!user) {
        throw { name: "Unauthorized", message: "Invalid token" }
        }
    
        req.user = { id: user.id}
        console.log(req.user);
        

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication


