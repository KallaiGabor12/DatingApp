import { LogType } from "@prisma/client";
import { prisma } from "./prisma";
import { logDateToString } from "./dateUtils";


export default async function log(type: LogType, message: string | Error | unknown) {
    const DT = new Date();
    const datestring = logDateToString(DT);
    
    // Convert message to string if it's not already
    let messageString: string;
    if (typeof message === 'string') {
        messageString = message;
    } else if (message instanceof Error) {
        messageString = message.message || String(message);
    } else {
        messageString = String(message);
    }
    
    switch(type){
        case "LOG":
            console.log(`[${datestring}] - [LOG] ` + messageString)
            break;
        case "ERROR":
            console.error(`[${datestring}] - [ERROR] ` + messageString)
            break;
        case "WARN":
            console.warn(`[${datestring}] - [WARN] ` + messageString)
            break;
        default: return;
    }
    try{
        await prisma.log.create({
            data:{
                date: DT,
                type: type,
                message: messageString,
            }
        })
    }catch (error){
        console.error(error)
    }
}

// Re-export for backward compatibility
export { logDateToString };