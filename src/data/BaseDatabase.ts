import Knex from "knex";
import knex from "knex"
import dotenv from "dotenv"

dotenv.config();
export default class BaseDatabase {

    private static connection: Knex | null = null;

    protected TABLENAMES = {
        music: "Music",
        genre: "Genre",
        user: "User_Music"
    }

    protected getConnection(): Knex{
        if(!BaseDatabase.connection){
            BaseDatabase.connection = knex({
                client: "mysql",
                connection: {
                  host: process.env.DB_HOST,
                  port: 3306,
                  user: process.env.DB_USER,
                  password: process.env.DB_PASSWORD,
                  database: process.env.DB_DATABASE_NAME,
                },
              });        
        }

        return BaseDatabase.connection;
    }

    public static async destroyConnection(): Promise<void>{
        if(BaseDatabase.connection){
            await BaseDatabase.connection.destroy();
            BaseDatabase.connection = null;
        }
    }
}