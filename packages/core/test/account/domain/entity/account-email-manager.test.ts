import {
    AccountEmailCorruptedStateError,
    AccountEmailManager,
    CantVerifyEmailError,
    EmailAddress,
    EmailAlreadyVerifiedError,
    EmailVerificationToken,
} from '@core/account'

describe('Account Email Manager Unit Tests', () => {
    const validEmail = EmailAddress.create('user@example.com')

    it('should initialize in the initial state', () => {
        const accountEmailManager = AccountEmailManager.create(validEmail)

        expect(accountEmailManager.isEmailAddressVerified()).toBeFalsy()
    })

    it('should generate a token and set verification state', () => {
        const accountEmailManager = AccountEmailManager.create(validEmail)

        const token = accountEmailManager.generateVerificationToken()

        expect(token).toBeInstanceOf(EmailVerificationToken)
    })

    it('should verify if token is valid and not expired', () => {
        const accountEmailManager = AccountEmailManager.create(validEmail)

        const token = accountEmailManager.generateVerificationToken()

        expect(() => accountEmailManager.verifyEmailAddress(token)).not.toThrow()

        expect(accountEmailManager.isEmailAddressVerified()).toBeTruthy()
    })

    it('should throw EmailAlreadyVerifiedError when verifying again', () => {
        const accountEmailManager = AccountEmailManager.create(validEmail)

        const token = accountEmailManager.generateVerificationToken()

        accountEmailManager.verifyEmailAddress(token)

        expect(() => accountEmailManager.verifyEmailAddress(token)).toThrow(
            EmailAlreadyVerifiedError,
        )
    })

    it('should throw CantVerifyEmailError on expired token', () => {
        const accountEmailManager = AccountEmailManager.create(validEmail)

        const token = accountEmailManager.generateVerificationToken()

        const oldDate = new Date(Date.now() - 3600 * 1000)

        const obj = {
            emailAddress: validEmail,
            token,
            tokenExpiresAt: oldDate,
            verifiedAt: null,
        }

        const expired = AccountEmailManager.recreate(obj)

        expect(() => expired.verifyEmailAddress(token)).toThrow(CantVerifyEmailError)
    })

    it('should throw CantVerifyEmailError on mismatched token', () => {
        const accountEmailManager = AccountEmailManager.create(validEmail)

        const token = accountEmailManager.generateVerificationToken()

        const wrongToken = EmailVerificationToken.generateToken()

        expect(token.equals(wrongToken)).toBeFalsy()

        expect(() => accountEmailManager.verifyEmailAddress(wrongToken)).toThrow(
            CantVerifyEmailError,
        )
    })

    it('should throw AccountEmailCorruptedStateError on invalid state', () => {
        const obj = {
            emailAddress: validEmail,
            token: null,
            tokenExpiresAt: new Date(),
            verifiedAt: new Date(),
        }

        expect(() => AccountEmailManager.recreate(obj)).toThrow(AccountEmailCorruptedStateError)
    })

    it('should serialize and deserialize correctly', () => {
        const email = AccountEmailManager.create(validEmail)

        const verifiedEmail = AccountEmailManager.recreate(email.toObject())

        expect(verifiedEmail.toObject()).toEqual(email.toObject())
    })
})
