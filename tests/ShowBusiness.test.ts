import { ShowBusiness } from "../src/business/ShowBusiness"
import { InvalidInputError } from "../src/error/InvalidInputError"
import { NotFoundError } from "../src/error/NotFoundError"
import { Band } from "../src/model/Band"
import { Show, ShowInputDTO, WeekDay } from "../src/model/Show"
import { UserRole } from "../src/model/User"

const showDatabase = {
    createShow: jest.fn((async(show: Show) => { })),
    getShowsByTimes: jest.fn((
        weekDay: string,
        startTime: number,
        endTime: number) => {
            if (weekDay === "FRIDAY" && startTime === 10 && endTime === 12) {
                return ["show_marcado"]
            } else {
                return new Array
            }
        }),
    getShowsByWeekDayOrFail: jest.fn((weekDay: string) => {
        switch(weekDay) {
            case "FRIDAY":
                return ["show_1", "show_2"]
            case "SATURDAY":
                return ["show_3", "show_4"]
            case "SUNDAY":
                throw new NotFoundError(`Unable to found shows in this weekDay: ${weekDay}`)
            default: 
                throw new InvalidInputError("Invalid weekDay")
        }
    })
}
const bandDatabase = {
    createBand: jest.fn(async(band: Band) => { }),
    getBandByIdOrNameOrFail: jest.fn((input: string) => {
        if (input === "idValido" || input === "nomeValido") {
            return {
                id: "idBanda",
                name: "Labanda",
                mainGenre: "BACK N'ROLL",
                responsible: "Amandinha"
            }
        } else {
            throw new NotFoundError(`Unable to found band with input: ${input}`)
        }
    })
}
const authenticator = {
    generateToken: jest.fn((payload: {id: string, role: UserRole}) => "token_ablubluble"),
    getData: jest.fn((token: string) => {
        switch (token) {
            case "userToken":
                return { id: "id_do_token", role: "NORMAL" }
            case "adminToken":
                return { id: "id_do_token", role: "ADMIN" }
            default:
                return undefined
        }
    })
}
const idGenerator = {
    generate: jest.fn(() => "idShow")
}

const showBusiness = new ShowBusiness(
    showDatabase as any,
    bandDatabase as any,
    idGenerator as any,
    authenticator as any
)

describe("CreateShow Test Flow", () => {
    test("Should return error when no weekDay", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            startTime: 9,
            endTime: 12,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no bandId", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            startTime: 9,
            endTime: 12,
            weekDay: "FRIDAY"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no endTime", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            startTime: 9,
            weekDay: "FRIDAY",
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no startTime", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            endTime: 12,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when user is not an ADMIN", async() => {
        expect.assertions(2)

        const token = "userToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 9,
            endTime: 12,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Only admins can access this feature")
            expect(error.code).toBe(403)
        }
    })
    test("Should return error when start or end time are not integer", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 9.5,
            endTime: 12,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Times should be integer to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when startTime is less than 8", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 7,
            endTime: 12,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid times to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when endTime is greater than 23", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 9,
            endTime: 24,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid times to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when startTime is greater than endTime", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 10,
            endTime: 9,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("Invalid times to createShow")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when invalid bandId", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 10,
            endTime: 16,
            bandId: "qualquerCoisaInvalida"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe(`Unable to found band with input: ${show.bandId}`)
            expect(error.code).toBe(404)
        }
    })
    test("should return error when the date and time is not available", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 10,
            endTime: 12,
            bandId: "idValido"
        } as ShowInputDTO

        try {
            await showBusiness.createShow(show, token)
        } catch (error) {
            expect(error.message).toBe("No more shows can be created at this times")
            expect(error.code).toBe(417)
        }
    })
    test("Should create a show", async() => {
        expect.assertions(1)

        const token = "adminToken"
        const show = {
            weekDay: "FRIDAY",
            startTime: 10,
            endTime: 16,
            bandId: "idValido"
        } as ShowInputDTO

        await showBusiness.createShow(show, token)
        expect(showDatabase.createShow).toHaveBeenCalledWith({
            "id": "idShow",
            "startTime": 10,
            "endTime": 16,
            "bandId": "idValido",
            "weekDay": "FRIDAY"
        })
    })
})

describe("GetShowsByWeekDay Tes Flow", () => {
    test("Should return error when no input", async() => {
        expect.assertions(2)

        const input = ""

        try {
            await showBusiness.getShowsByWeekDay(input as WeekDay)
        } catch(error) {
            expect(error.message).toBe("Invalid input to getShowsByWeekDay")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no input", async() => {
        expect.assertions(2)

        const input = WeekDay.SUNDAY

        try {
            await showBusiness.getShowsByWeekDay(input as WeekDay)
        } catch(error) {
            expect(error.message).toBe(`Unable to found shows in this weekDay: ${input}`)
            expect(error.code).toBe(404)
        }
    })
    test("Should return error when no input", async() => {
        expect.assertions(2)

        const input = "ablubluble_das_ideia"

        try {
            await showBusiness.getShowsByWeekDay(input as WeekDay)
        } catch(error) {
            expect(error.message).toBe("Invalid weekDay")
            expect(error.code).toBe(417)
        }
    })
    test("Should return a shows by weekDay", async() => {
        expect.assertions(1)

        const input = WeekDay.FRIDAY

        await showBusiness.getShowsByWeekDay(input)
        expect(showDatabase.getShowsByWeekDayOrFail).toHaveBeenCalledWith(WeekDay.FRIDAY)
    })
})
