import { User, Auth } from "../models";
import * as crypto from "crypto"
import * as jwt from "jsonwebtoken"

export const SECRET = 'Leandro11';
export const getSHA256ofString = (input)=> {
    return crypto
    .createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex")
}

export async function signup(userData) {
    if (userData) {
        const {email, fullname, password } = userData
        const [user, created] = await User.findOrCreate({
            where: { email: email },
            defaults: {
              email,
              fullname,
            }
          });
          
          const [auth, authCreated] = await Auth.findOrCreate({
            where: { user_id: user.get('id') },
            defaults: {
              fullname,
              email,
              password: getSHA256ofString(password),
              user_id: user.get('id')
            }
          });
          return auth
        }else{
            throw console.error("error data")
        }
}

export async function signin(userData) {
    if (userData) {
        const {email, password } = userData
        const auth = await Auth.findOne({ 
            where: { 
            email,
            password: getSHA256ofString(password) 
          } 
          });
          const token = jwt.sign({ user_id: auth.get('user_id') }, SECRET);
          return token
        }else{
            throw console.error("error data")
        }
}