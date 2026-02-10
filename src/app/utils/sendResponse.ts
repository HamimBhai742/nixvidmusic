import { Response } from "express";

interface IMetaData{
    total:number;
    pages:number;
    limit:number;
    totalPages:number
}


interface ISendResponseData<T>{
    success:boolean;
    statusCode:number
    message:string;
    data:T
    metaData?:IMetaData
}

export const sendResponse=<T>(res:Response,sendData:ISendResponseData<T>)=>{
    const {data,statusCode,message,success,metaData}=sendData;
res.status(statusCode).json({
    success,
    message,
    data,
    metaData
})
}