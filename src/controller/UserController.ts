import { Request, Response } from "express";
import { UserInputDTO, LoginInputDTO, User} from "../model/User";
import { UserBusiness } from "../business/UserBusiness";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";

export class UserController {
    async signup(req: Request, res: Response) {
        try {

            const input: UserInputDTO = {
                name: req.body.name,
                nickname: req.body.nickname,
                password: req.body.password,
                email: req.body.email

            }

            const userBusiness = new UserBusiness(
                new UserDatabase,
                new IdGenerator,
                new HashManager,
                new Authenticator
            );
            const token = await userBusiness.createUser(input);

            res.status(200).send({ token });

        } catch (error) {
            res.status(400).send({ error: error.message });
        }


    }

    async login(req: Request, res: Response) {

        try {

            const loginData: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            };

            const userBusiness = new UserBusiness(
                new UserDatabase,
                new IdGenerator,
                new HashManager,
                new Authenticator
            );
            const token = await userBusiness.login(loginData);

            res.status(200).send({ token });

        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

}