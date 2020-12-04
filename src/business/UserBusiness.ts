import { UserInputDTO, LoginInputDTO, User } from "../model/User"
import { UserDatabase } from "../data/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { HashManager } from "../services/HashManager"
import { Authenticator } from "../services/Authenticator"

import { BaseError } from "../error/BaseError"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) { }

    async createUser(user: UserInputDTO) {
        try {
            if (!user.email || !user.name || !user.password || !user.nickname) {
                throw new BaseError("invalid input", 422)
            }

            if (user.email.indexOf("@") === -1) {
                throw new BaseError("Invalid email format", 422)
            }

            if (user.password && user.password.length < 6) {
                throw new BaseError("Password should have more than 6 digits", 422)
            }

            const userId = this.idGenerator.generate()

            const hashPassword = await this.hashManager.hash(user.password)

            await this.userDatabase.createUser(
                    userId,
                    user.name,
                    user.nickname,
                    hashPassword,
                    user.email
            )

            const accessToken = this.authenticator.generateToken({ id: userId })

            return accessToken
        }
        catch (error) {
            throw new BaseError(error.message, error.statusCode)
        }
    }
    async login(user: LoginInputDTO) {

        try {
            if (!user.email || !user.password)
            throw new BaseError("Invalid input to login", 422)


        if (user.email.indexOf("@") === -1) {
            throw new BaseError("Invalid email format", 422)
        }

        const userFromDB = await this.userDatabase.login(user.email)
        if(!userFromDB){
            throw new BaseError("invalid credentials",401)
        }
        const hashCompare = await this.hashManager.compare(user.password, userFromDB.getPassword())

        if (!hashCompare) {
            throw new BaseError("Invalid password", 400)
        }

        const accessToken = this.authenticator.generateToken({ id: userFromDB.getId() })

        return accessToken
            
        } catch (error) {
            console.log(user)
            throw new BaseError(error.message, error.statusCode)
        }
    }  
}