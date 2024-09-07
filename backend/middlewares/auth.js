import zod from 'zod'
const stringSchema = zod.string()
import jwt from 'jsonwebtoken'
export default function authMiddleware(req, res, next){
    const token = req.headers.authorization.split(' ')[1]
    // console.log(req.headers)
    console.log(token)
    try{
        const result = jwt.verify(token, process.env.JWT_SECRET)
        console.log(result)
        req.userId = result.userId;
        next()
    } catch(err){
        res.status(403).json({message: ""})
    }   

}