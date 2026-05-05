import { AccountName, InvalidAccountNameError } from '@core/account'

describe('AccountName Unit Tests', () => {
    it('should be able to create a valid account name if the string is valid', () => {
        const accountNameString = '   John    Doe   '

        const formattedAccountNameString = accountNameString
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase())

        const accountName = AccountName.create(accountNameString)

        expect(accountName.toString()).toBe(formattedAccountNameString)
    })

    it('should throw an error when trying to create an account name with the length less than 3', () => {
        const accountNameString = 'fo'

        expect(() => AccountName.create(accountNameString)).toThrow(InvalidAccountNameError)
    })

    it('should throw an error when trying to create an account name with length greater than 50', () => {
        const accountNameString = 'foo'.repeat(50)

        expect(() => AccountName.create(accountNameString)).toThrow(InvalidAccountNameError)
    })

    it('should throw an error when trying to create an account name with invalid characters', () => {
        const accountNameString = 'Foo@Bar Jr.'

        expect(() => AccountName.create(accountNameString)).toThrow(InvalidAccountNameError)
    })
})
