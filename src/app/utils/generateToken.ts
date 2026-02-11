import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import config from '../../config'
import { Prisma } from '@prisma/client'


export const generateToken=async(user:Prisma.UserCreateInput)=>{
    const payload= {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    const token=await jwt.sign(payload,config.jwt.access_secret as Secret,
    {expiresIn:config.jwt.access_expires_in}as SignOptions)
    return token
}

export const generateForgetToken=async(user:any,secret:Secret,expiresIn:string)=>{
    const payload= {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
    const token=await jwt.sign(payload,secret,
    {expiresIn:expiresIn} as SignOptions)
    return token
}