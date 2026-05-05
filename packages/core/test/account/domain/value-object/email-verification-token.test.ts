import { EmailVerificationToken, InvalidEmailVerificationTokenError } from '@core/account'
import { validate } from 'uuid'

describe('Email Verification Token Unit Tests', () => {
    it('Should be able to create a valid email verification token', () => {
        const emailVerificationToken = EmailVerificationToken.generateToken()

        expect(emailVerificationToken).toBeDefined()

        expect(validate(emailVerificationToken.toString())).toBeTruthy()
    })

    it('Should throw an error when email verification token is invalid', () => {
        expect(() => EmailVerificationToken.fromString('invalid-token')).toThrow(
            InvalidEmailVerificationTokenError,
        )
    })

    it('Should be able to compare with another email verification token', () => {
        const emailVerificationTokenA = EmailVerificationToken.generateToken()

        const emailVerificationTokenB = EmailVerificationToken.generateToken()

        const emailVerificationTokenC = EmailVerificationToken.fromString(
            emailVerificationTokenA.toString(),
        )

        expect(emailVerificationTokenA.equals(emailVerificationTokenB)).toBeFalsy()

        expect(emailVerificationTokenB.equals(emailVerificationTokenA)).toBeFalsy()

        expect(emailVerificationTokenA.equals(emailVerificationTokenC)).toBeTruthy()

        expect(emailVerificationTokenC.equals(emailVerificationTokenA)).toBeTruthy()

        expect(emailVerificationTokenB.equals(emailVerificationTokenC)).toBeFalsy()
    })
})
