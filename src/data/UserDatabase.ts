
import { User } from "../model/User";
import BaseDatabase from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

  private static TABLE_NAME = "User_Music";

  public async createUser(id:string, name:string, nickname:string, password:string, email:string): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          nickname,
          password,
          email
 
        })
        .into(UserDatabase.TABLE_NAME)
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
  }

  public async login(email: string): Promise<User> {
    try {
      const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ email });

    console.log(result[0])
    
    return User.toUserModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message)
    }
 
  }

}
