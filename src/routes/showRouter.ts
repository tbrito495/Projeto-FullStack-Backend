import express from "express"
import { ShowController } from "../controller/ShowCOntroller"


export const showRouter = express.Router()

const showController = new ShowController()

showRouter.put("/create", showController.createShow)
showRouter.get("/get-by-week-day", showController.getShowsByWeekDay)

