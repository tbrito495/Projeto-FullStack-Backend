import { Request, Response } from "express"

import { MusicInputDTO } from "../model/Music"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"
import { MusicBusiness } from "../business/MusicBusiness"
import { MusicDatabase } from "../data/MusicDatabase"
import BaseDatabase from "../data/BaseDatabase"

export class MusicController {
    async registerMusic(req: Request, res: Response) {
        try {
            const input: MusicInputDTO = {
                title: req.body.title,
                file: req.body.file,
                genre: req.body.genre,
                album: req.body.album,
                author_name:req.body.author_name
            }
    
            const musicBusiness = new MusicBusiness(
                new MusicDatabase,
                new IdGenerator,
                new Authenticator
            )
    
            await musicBusiness.registerMusic(input, req.headers.authorization as string)
    
            res.status(200).send({message:"created"})
        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message
            })
        }
    }

    async getMusic(req: Request, res: Response) {
        try {
            const input = req.params.id as string

            const musicBusiness = new MusicBusiness(
                new MusicDatabase,
                new IdGenerator,
                new Authenticator
            )
            const token = await musicBusiness.getMusic(input, req.headers.authorization as string)

            res.status(200).send(token)
        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message,
            })
        } 
    }

    async getAllMusic(req: Request, res: Response) {
        try {
          
            const musicBusiness = new MusicBusiness(
                new MusicDatabase,
                new IdGenerator,
                new Authenticator
            )
            const token = await musicBusiness.getAllMusic( req.headers.authorization as string)

            res.status(200).send(token)
        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message,
            })
        } 
    }
}