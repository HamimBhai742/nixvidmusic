import jwt, { Secret } from 'jsonwebtoken'
export const verifyToken=async(token: string,secret:Secret)=>{
    return jwt.verify(token,secret)
}