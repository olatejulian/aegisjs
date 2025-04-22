import {
    AccountEmail,
    AccountEmailCorruptedStateError,
    CantVerifyEmailError,
    EmailAddress,
    EmailAlreadyVerifiedError,
    EmailVerificationToken,
} from '@core/account'

describe('_AccountEmail', () => {
    const validEmail = EmailAddress.create('user@example.com')

    it('should initialize in the initial state', () => {
        const email = AccountEmail.create(validEmail)

        expect(email.isAlreadyVerified()).toBeFalsy()
    })

    it('should generate a token and set verification state', () => {
        const email = AccountEmail.create(validEmail)

        const token = email.generateToken()

        expect(token).toBeInstanceOf(EmailVerificationToken)
    })

    it('should verify if token is valid and not expired', () => {
        const email = AccountEmail.create(validEmail)

        const token = email.generateToken()

        expect(() => email.verify(token)).not.toThrow()

        expect(email.isAlreadyVerified()).toBeTruthy()
    })

    it('should throw EmailAlreadyVerifiedError when verifying again', () => {
        const email = AccountEmail.create(validEmail)
        const token = email.generateToken()

        email.verify(token)

        expect(() => email.verify(token)).toThrow(EmailAlreadyVerifiedError)
    })

    it('should throw CantVerifyEmailError on expired token', () => {
        const email = AccountEmail.create(validEmail)
        const token = email.generateToken()

        const oldDate = new Date(Date.now() - 3600 * 1000)
        const obj = {
            emailAddress: validEmail,
            token,
            tokenExpiresAt: oldDate,
            verifiedAt: null,
        }

        const expired = AccountEmail.fromObject(obj)

        expect(() => expired.verify(token)).toThrow(CantVerifyEmailError)
    })

    it('should throw CantVerifyEmailError on mismatched token', () => {
        const email = AccountEmail.create(validEmail)
        email.generateToken()

        const wrongToken = EmailVerificationToken.generateToken()

        expect(() => email.verify(wrongToken)).toThrow(CantVerifyEmailError)
    })

    it('should throw AccountEmailCorruptedStateError on invalid state', () => {
        const obj = {
            emailAddress: validEmail,
            token: null,
            tokenExpiresAt: new Date(),
            verifiedAt: new Date(),
        }

        expect(() => AccountEmail.fromObject(obj)).toThrow(
            AccountEmailCorruptedStateError
        )
    })

    it('should serialize and deserialize correctly', () => {
        const email = AccountEmail.create(validEmail)

        const verifiedEmail = AccountEmail.fromObject(email.toObject())

        expect(verifiedEmail.toObject()).toEqual(email.toObject())
    })
})
