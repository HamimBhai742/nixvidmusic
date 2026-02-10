import { prisma } from "../utils/prisma";

export const connectedDb = async() =>{
    try {
     await prisma.$connect();
     console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Database Connection Failed");
    }
}