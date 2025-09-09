import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { UserTable } from "../entities/UserTable";
import type { LoginModel } from "../models/login.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { RegisterModel } from "../models/register.model";
import type { EditModel } from "../models/edit.model";

const repo = AppDataSource.getRepository(UserTable)
const tokenSecret = process.env.JWT_SECRET
const accessTTL = process.env.JWT_ACCESS_TTL
const refreshTTL = process.env.JWT_REFRESH_TTL

export class UserService {

    static async login(model: LoginModel) {
        console.log('Back Checkpoint 1')
        const user = await this.getUserByEmail(model.email)

        if (await bcrypt.compare(model.password, user!.password)) {
            console.log('if checkpoint reached')
            const payload = {
                id: user?.userId,
                email: user?.email
            }

            return {
                name: user?.email,
                access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, tokenSecret!, { expiresIn: refreshTTL }),
                userId: user?.userId
            }
        }

        throw new Error('BAD_CREDENTIALS')
    }

    static async verifyToken(req: any, res: Response, next: Function) {
        const whitelist = ['/api/user/login', '/api/user/refresh', '/api/user/register', 'api/user/edit']

        if (whitelist.includes(req.path)) {
            next()
            return
        }

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == undefined) {
            res.status(401).json({
                message: "NO_TOKEN_FOUND",
                timestamp: new Date()
            })
            return
        }

        jwt.verify(token, tokenSecret!, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    message: 'INVALID_TOKEN',
                    timestamp: new Date()
                })
                return
            }
            req.user = user
            next()
        })
    }

    static async refreshToken(token: string) {
        const decoded: any = jwt.verify(token, tokenSecret!)

        const user = await this.getUserByEmail(decoded.email)

        const payload = {
            id: user?.userId,
            email: user?.email
        }


        return {
            name: user?.email,
            access: jwt.sign(payload, tokenSecret!, { expiresIn: accessTTL }),
            refresh: token,
            userId: user?.userId
        }
    }

    static async register(model: RegisterModel) {
        const data = await repo.existsBy({
            email: model.email,
            deletedAt: IsNull()
        })

        if (data)
            throw new Error("USER_ALREADY_EXISTS")
        const hashed = await bcrypt.hash(model.password, 12)
        await repo.save({
            email: model.email,
            password: hashed,
            userName: model.name
        })
        console.log('we got here')
    }

    static async editUser(id: number, edit:EditModel) { 
          
        const data = await repo.findOne({
            where:{
                userId: id,
                deletedAt:IsNull()
            }
        })
        if(data == null){
            throw new Error('USER_DOES_NOT_EXIST')
        }
        const hashed = await bcrypt.hash(edit.password, 12)
        await repo.update({userId: data.userId},{userName:edit.username, password:hashed, updatedAt: new Date()})
    }

    static async getUsers() {
        const data = await repo.find({
            where: {
                deletedAt: IsNull()
            }
        })
        if (data == null) {
            throw new Error("NO_USERS___SOMEHOW")
        }
        return data
    }

    static async getUserById(id: number) {
        const data = repo.findOne({
            where: {
                userId: id,
                deletedAt: IsNull()
            }
        })

        if (data == null) 
            throw new Error("USER_NOT_EXIST")

        return data
    }

    static async getUserByEmail(email: string) {
        const data = repo.findOne({
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (data == null)
            throw new Error("USER_NOT_FOUND")
        return data
    }
}