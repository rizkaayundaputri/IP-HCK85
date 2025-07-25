const {User} = require ('../models/index.js')
const {signToken} = require ('../helpers/jwt.js')
const { comparePassword } = require('../helpers/bcrypt.js')
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../helpers/nodemailer.js');

class UserController {
    static async register(req,res,next){
        try {
         const {name,email,password} = req.body
         let data = await User.create({name,email,password})
         
        sendEmail(data.email)
         res.status(201).json({name: data.name, id : data.id, email: data.email})        
        } catch (error) {
          // console.log(error);
         next(error)            
         
        }
    }

    static async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body
      if (!googleToken) throw { name: "BadRequest", message: "Google Token is required" }

      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: "260207133908-c4tbmnsv3g32or8tr2gjnl472frns19t.apps.googleusercontent.com"
      })

      const payload = ticket.getPayload()
      const randomPassword = payload.sub + Date.now().toString() + Math.random().toString(36).substring(2, 15) 
      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          email: payload.email,
          password: randomPassword, 
          name: payload.name,
        }
      })

      const access_token = signToken({ id: user.id })

      res.status(created ? 201 : 200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }


    static async login(req,res,next){
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw { name: "BadRequest", message: "Email and Password required" }
            }
            const user = await User.findOne({
                where: {
                email
                }
            })
            if (!user) {

                throw { name: "Unauthorized", message: 'Invalid email/password' }
            }
            const isPasswordValid = comparePassword(password, user.password)
            if (!isPasswordValid) {
                throw { name: "Unauthorized", message: 'Invalid email/password' }
            }
            const access_token = signToken({ id: user.id })
            res.status(200).json({ access_token })
        } catch (error) {
            next(error)
            console.log(error);
            }
            
        }
}

module.exports = UserController 