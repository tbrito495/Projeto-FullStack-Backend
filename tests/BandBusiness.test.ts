import { BandBusiness } from "../src/business/BandBusiness"
import { NotFoundError } from "../src/error/NotFoundError"
import { Band, BandInputDTO } from "../src/model/Band"
import { UserRole } from "../src/model/User"

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
    generate: jest.fn(() => "idBanda")
}

const bandBusiness = new BandBusiness(
    bandDatabase as any,
    idGenerator as any,
    authenticator as any
)

describe("RegisterBand Test Flow", () => {
    test("Should return error when no name", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const band = {
            mainGenre: "BACK N'ROLL",
            responsible: "Severo"
        } as BandInputDTO

        try {
            await bandBusiness.registerBand(band, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to registerBand")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no responsible", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const band = {
            mainGenre: "BACK N'ROLL",
            name: "Darvas Band"
        } as BandInputDTO

        try {
            await bandBusiness.registerBand(band, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to registerBand")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no mainGenre", async() => {
        expect.assertions(2)

        const token = "adminToken"
        const band = {
            name: "Banda da Night",
            responsible: "Severo"
        } as BandInputDTO

        try {
            await bandBusiness.registerBand(band, token)
        } catch (error) {
            expect(error.message).toBe("Invalid input to registerBand")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when user is not an ADMIN", async() => {
        expect.assertions(2)

        const token = "userToken"
        const band = {
            name: "Banda da Night",
            responsible: "Severo",
            mainGenre: "SAMBA"
        } as BandInputDTO

        try {
            await bandBusiness.registerBand(band, token)
        } catch (error) {
            expect(error.message).toBe("Only admins can access this feature")
            expect(error.code).toBe(403)
        }
    })
    test("Should register a band", async() => {
        expect.assertions(1)

        const token = "adminToken"
        const band = {
            name: "Banda da Night",
            responsible: "Severo",
            mainGenre: "SAMBA"
        } as BandInputDTO
 
        await bandBusiness.registerBand(band, token)

        expect(bandDatabase.createBand).toHaveBeenCalledWith({
            "id": "idBanda",
            "mainGenre": "SAMBA",
            "name": "Banda da Night",
            "responsible": "Severo"
        })
    })
})

describe("GetBandDetail Test Flow", () => {
    test("Should return error when no input", async() => {
        expect.assertions(2)

        const input = ""

        try {
            await bandBusiness.getBandDetailByIdOrName(input)
        } catch (error) {
            expect(error.message).toBe("Invalid input to getBandDetails")
            expect(error.code).toBe(417)
        }
    })
    test("Should return error when no input", async() => {
        expect.assertions(2)

        const input = "qualquerCoisaInvalida"

        try {
            await bandBusiness.getBandDetailByIdOrName(input)
        } catch (error) {
            expect(error.message).toBe(`Unable to found band with input: ${input}`)
            expect(error.code).toBe(404)
        }
    })
    test("Should return band when valid id", async() => {
        expect.assertions(1)

        const input = "idValido"

        const result = await bandBusiness.getBandDetailByIdOrName(input)
        expect(JSON.stringify(result)).toBe(JSON.stringify({
            id: "idBanda",
            name: "Labanda",
            mainGenre: "BACK N'ROLL",
            responsible: "Amandinha"
        }))
    })
    test("Should return band when valid id", async() => {
        expect.assertions(1)

        const input = "nomeValido"

        const result = await bandBusiness.getBandDetailByIdOrName(input)
        expect(JSON.stringify(result)).toBe(JSON.stringify({
            id: "idBanda",
            name: "Labanda",
            mainGenre: "BACK N'ROLL",
            responsible: "Amandinha"
        }))
    })
})