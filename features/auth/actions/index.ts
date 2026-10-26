"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { use } from "react";

export const getUserById = async(id:string) => {
    try{
        const user = await db.user.findUnique({
            where:{id},
            include:{accounts:true}
        });
        return user;
    }catch (error){
        console.error(error);
        return null;
    }
}

export const getAccountByUserId = async(userId:string)=>{
    try{
        const account = await db.account.findFirst({
            where:{
                userId
            }
        });
        return account;
    }catch(error){
        console.error(error);
        return null;
    }
}

export const currentuser = async()=>{
    const user = await auth();
    return user?.user;
}