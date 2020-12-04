import { BaseError } from "../error/BaseError";
import { Music } from "../model/Music";
import BaseDatabase  from "./BaseDatabase";

export class MusicDatabase extends BaseDatabase {

    private static TABLE_NAME = "Music"
    private static TABLE_GENRE = "Genre"

    public async createMusic(music: Music): Promise<void> {
        try {
            await this.getConnection()
            .insert({
                id: music.getId(),
                title: music.getTitle(),
                author: music.getAuthor(),
                date: music.getDate(),
                file: music.getFile(),
                genre: music.getGenre(),
                album: music.getAlbum(),
            })
            .into(MusicDatabase.TABLE_NAME)

            const result = await this.getConnection()
                .select("genre")
                .from(MusicDatabase.TABLE_GENRE)
                .where({ genre:music.getGenre() })

            if (result.length <= 0) {
                await this.getConnection()
                    .insert({ genre_id:music.getId(), genre:music.getGenre() })
                    .into(MusicDatabase.TABLE_GENRE);  
            }

            return

        } catch (err) {
            console.log(music)
            throw new Error(err.sqlMessage || err.message)
        }
    }

    public async getMusic(input: string): Promise<any> {
        console.log({id:input})
        try {
            // const music = await this.getConnection()
            // .select("*")
            // .from(MusicDatabase.TABLE_NAME)
            // .where({ id: input })
            const music = await this.getConnection().raw(`
                SELECT * from ${MusicDatabase.TABLE_NAME} WHERE id = '${input}'
                `)

            console.log(music[0][0])

            return Music.toMusicModel(music[0][0])
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }

    }
}