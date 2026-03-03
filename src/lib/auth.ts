import crypto from "crypto";
import { compare, genSalt, hash } from "bcryptjs";

import Cryptr from 'cryptr';
import { User } from "@prisma/client";
import { prisma } from "./prisma";

const cryptr = new Cryptr(process.env.EMAIL_ENCRYPTION_KEY!);


export const encryptEmail = (email:string) => {
    return cryptr.encrypt(email);
}
export const decryptEmail = (encrypted:string) => {
    return cryptr.decrypt(encrypted);
}
export const hashPassword = async (password:string) => {
    return await hash(password, await genSalt(10));
}
export const verifyPassword = async (password:string, hash:string) => {
    return await compare(password, hash);
}
export const normalizeEmail = (email:string): string => {
    return email.trim().toLowerCase();
}

export const getRecordByEmail = async (email: string): Promise<User|null> => {
    let records = await prisma.user.findMany();
    email = normalizeEmail(email);
    let found = null;
    records.forEach(r => {
        let decrypted = decryptEmail(r.email);
        if(decrypted == email){
            found = r;
            return;
        }
    })
    return found;
}


export const isValidEmail = (email:string): boolean => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && email.length < 254;
}

export const isValidPassword = (passw:string): boolean|string => {
    if(passw.length < 7) return "túl rövid";
    if(!/\d/.test(passw)) return "nem tartalmaz számot";
    if(!/[a-z]/.test(passw)) return "nem tartalmaz kisbetűt";
    if(!/[A-Z]/.test(passw)) return "nem tartalmaz nagybetűt";
    return true;
}

export const createUser = async(data: {email:string,password:string}): Promise<User> => {
    let email = encryptEmail(data.email);
    let password = await hashPassword(data.password)

    return await prisma.user.create({data:{
        email: email,
        password: password,
    }})
} 