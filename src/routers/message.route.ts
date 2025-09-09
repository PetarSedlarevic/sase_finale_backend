import { Router } from "express";
import { MessageService } from "../services/message.service";
import { sendError } from "../utils";

export const MessageRoute = Router()

MessageRoute.post('/post', async (req:any, res) =>{
    try {
        await MessageService.postMessage(req.body, req.user.id)
    }catch (e: any) {
        sendError(res, e, 401)
    }
})

MessageRoute.get('/:id', async (require, res) =>{
    try{
        const id = Number(require.params.id)

        res.json(await MessageService.getMessageById(id))
    }catch(e){
        sendError(res, e)
    }
})

MessageRoute.put('/delete', async (req, res) =>{
    try{
        await MessageService.deleteMessage(req.body)
    } catch(e){
        sendError(res, e)
    }
})

MessageRoute.post('/:id/eidt', async (require, res) =>{
    try {
        const id = Number(require.params.id)
        await MessageService.editMessage(id, require.body)
    }catch (e) {
        sendError(res, e)
    }
})

MessageRoute.get('/', async (req, res) =>{
    try{
        res.json(await MessageService.getMessage())
    }catch(e) {
        sendError(res, e)
    }
})