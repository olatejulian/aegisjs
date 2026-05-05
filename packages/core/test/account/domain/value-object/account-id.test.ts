import { AccountId, InvalidAccountIdError } from '@core/account'

describe('Account Id Unit Tests', () => {
    it('should be able to create a valid account id', () => {
        const AccountIdString = '123e4567-e89b-12d3-a456-426614174000'

        const accountId = AccountId.fromString(AccountIdString)

        expect(accountId.toString()).toBe(AccountIdString)
    })

    it('should throw an error when trying to create an account id with an empty value', () => {
        const AccountIdString = ''

        expect(() => AccountId.fromString(AccountIdString)).toThrow(InvalidAccountIdError)
    })

    it('should throw an error when trying to create an account id with an invalid value', () => {
        const AccountIdString = 'invalid-value'

        expect(() => AccountId.fromString(AccountIdString)).toThrow(InvalidAccountIdError)
    })

    it('should be able to compare with another account id', () => {
        const AccountIdString = '123e4567-e89b-12d3-a456-426614174000'

        const accountId = AccountId.fromString(AccountIdString)

        const anotherAccountId = AccountId.fromString(AccountIdString)

        const areEqual = accountId.equals(anotherAccountId)

        expect(areEqual).toBe(true)
    })

    it('should be able to compare with another account id and return false', () => {
        const AccountIdString = '123e4567-e89b-12d3-a456-426614174000'

        const accountId = AccountId.fromString(AccountIdString)

        const anotherAccountId = AccountId.fromString('123e4567-e89b-12d3-a456-426614174111')

        const areEqual = accountId.equals(anotherAccountId)

        expect(areEqual).toBe(false)
    })
})
