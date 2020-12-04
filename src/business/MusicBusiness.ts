import {MusicDatabase} from"../data/MusicDatabase"
import { BaseError } from "../error/BaseError"
import { Music, MusicInputDTO } from "../model/Music"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"

export class MusicBusiness {
    constructor(
        private musicdatabase: MusicDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ) { }

    async registerMusic(input: MusicInputDTO, token: string) {
        try {
            const tokenData = this.authenticator.getData(token)
            if(!tokenData){
                throw new BaseError("not authorized", 401)
            }
            
            if (!input.title || !input.file || !input.genre || !input.album) {
                throw new BaseError("Invalid input to register music", 422)
            }
            
            const date = new Date()
    
    
           const result = await this.musicdatabase.createMusic(
                Music.toMusicModel({
                    ...input,
                    date:date,
                    author:tokenData.id,
                    id: this.idGenerator.generate()
                })!
                
            )
            return result
        } catch (error) {
           throw new BaseError(error.message, error.statusCode)
        }

    }

    async getMusic(input: string, token:string): Promise<Music> {
 
       try {
        const tokenData = this.authenticator.getData(token)

        if(!tokenData){
                throw new BaseError("not authorized", 401)
            }
        if (!input) {
            throw new BaseError("Invalid input to getMusicDetails", 400)
        }

         const result = await this.musicdatabase.getMusic(input)
         return result
    }   
       catch (error) {
           throw new BaseError(error.message, error.statusCode)
       } 
    }
}