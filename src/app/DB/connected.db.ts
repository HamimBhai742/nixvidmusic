import { prisma } from "../utils/prisma";

export const connectedDb = async() =>{
     await prisma.$connect().then(()=>{
        console.log('Databse connceted success')
     }).catch(()=>{
console.log("Database connceted failed")
     });
   
}