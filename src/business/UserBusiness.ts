import { UserInputDTO, LoginInputDTO, User } from "../model/User"
import { UserDatabase } from "../data/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { HashManager } from "../services/HashManager"
import { Authenticator } from "../services/Authenticator"
import { InvalidInputError } from "../error/InvalidInputError"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) { }

    async createUser(user: UserInputDTO) { 
        if (!user.email || !user.name || !user.password || !user.role) {
            throw new InvalidInputError("Invalid input to signUp")
        }

        if (user.email.indexOf("@") === -1) {
            throw new InvalidInputError("Invalid email format")
        }

        if (user.password && user.password.length < 6) {
            throw new InvalidInputError("Password should have more than 6 digits")
        }

        const userId = this.idGenerator.generate()

        const hashPassword = await this.hashManager.hash(user.password)

        await this.userDatabase.createUser(
            User.toUserModel({
                ...user,
                id: userId,
                password: hashPassword
            })
        )

        const accessToken = this.authenticator.generateToken({ id: userId , role: user.role })

        return accessToken
    }

    async authUserByEmail(user: LoginInputDTO) { 

        if (!user.email || !user.password )
        throw new InvalidInputError("Invalid input to login")


        if (user.email.indexOf("@") === -1) {
            throw new InvalidInputError("Invalid email format")
        }

        const userFromDB = await this.userDatabase.getUserByEmail(user.email)
        const hashCompare = await this.hashManager.compare(user.password, userFromDB.getPassword())

        if (!hashCompare) {
            throw new InvalidInputError("Invalid password")
        }

        const accessToken = this.authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() })

        return accessToken
    }
}