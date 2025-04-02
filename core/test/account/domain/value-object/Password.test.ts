import {InvalidPasswordError, Password} from '@core/account'

describe('Password Unit Tests', () => {
    it('should be able to create a valid password', async () => {
        const validPasswordString = 'Password@1234!'

        const password = await Password.create(validPasswordString)

        expect(password).toBeDefined()
    })

    it('should throw an error when password is invalid', async () => {
        const invalidPasswordString = 'foo'

        expect(async () => {
            await Password.create(invalidPasswordString)
        }).rejects.toThrow(InvalidPasswordError)
    })

    it('should be able to compare passwords', async () => {
        const passwordString = 'Password@1234!'

        const password = await Password.create(passwordString)

        expect(await password.compare(passwordString)).toBe(true)
    })

    it('should be able to compare passwords that are not the same and return false', async () => {
        const passwordString = 'Password@1234!'

        const password = await Password.create(passwordString)

        const differentPasswordString = 'DifferentPassword@1234!'

        expect(await password.compare(differentPasswordString)).toBe(false)
    })
})
