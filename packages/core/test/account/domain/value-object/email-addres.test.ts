import { EmailAddress, InvalidEmailAddressError } from '@core/account'

describe('Email Address Unit Tests', () => {
    it('should create a valid email address', () => {
        const emailAddressString = 'john.doe@email.com'

        const emailAddress = EmailAddress.create(emailAddressString)

        expect(emailAddress.toString()).toBeDefined()

        expect(emailAddress.toString()).toEqual(emailAddressString)
    })

    it('should throw an error when email address is invalid', () => {
        const invalidEmailAddress = 'invalid.email.com'

        expect(() => EmailAddress.create(invalidEmailAddress)).toThrow(InvalidEmailAddressError)
    })

    it('should be equal when email addresses are the same', () => {
        const emailAddressStringA = 'john.doe@email.com'

        const emailAddressA = EmailAddress.create(emailAddressStringA)

        const emailAddressStringB = 'john.doe@email.com'

        const emailAddressB = EmailAddress.create(emailAddressStringB)

        const isTheSameEmail = emailAddressA.equals(emailAddressB)

        expect(isTheSameEmail).toBe(true)
    })
})
