import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { MessageTable } from "../entities/MessageTable";
import type { MessageModel } from "../models/message.model";

const repo = AppDataSource.getRepository(MessageTable)

export class MessageService {
    static async postMessage(model: MessageModel, userId: number){
        // const data = await repo.existsBy({
        //     message: model.messageId,
        //     deletedAt: IsNull()
        // })

        await repo.save({
            messageId: model.messageId,
            title: model.title,
            content: model.content,
            adddedBy: model.userId
        })
    }

    static async getMessage(){
        const data = repo.find({
            where:{
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error('NO_SUCH_THING_EXISTS')
        }
        return data
    }

    static async getMessageById(id: number){
        const data = repo.findOne({
            where:{
                messageId: id,
                deletedAt: IsNull()
            }
        })
        if(data == null){
            throw new Error('MESSAGE_DOES_NOT_EXIST')
        }
        return data
    }

    static async getMessageByTitle(title: string){
        const data = repo.find({
            where:{
                title: title,
                deletedAt: IsNull()
            }
        })
        if(data == null){
            throw new Error('TITLE_NOT_FOUND')
        }
        return data
    }

    static async deleteMessage(messageId: any){
        const data = await repo.findOne({
            where:{
                messageId: messageId.id,
                deletedAt: IsNull()
            }
        })
        if (data == null){
            throw new Error('MESSAGE_NON_EXISTENT')
        }
        await repo.update({messageId: data.messageId},{deletedAt: new Date()})
    }

    static async editMessage(id: number, message:MessageModel){
        const data = await repo.findOne({
            where:{
                messageId: id,
                deletedAt: IsNull() 
            }
        })
        if(data == null){
            throw new Error('MESSAGE_DOES_NOT_EXIST')
        }
        await repo.update({messageId: data.messageId}, {title:message.title, content: message.content, updatedAt: new Date()})
    }

}