import { InvalidPasswordResetTokenError, PasswordResetToken } from '@core/account'
import { validate } from 'uuid'

describe('Password Reset Token Unit Tests', () => {
    it('Should be able to create a valid password reset token', () => {
        const passwordResetToken = PasswordResetToken.generateToken()

        expect(passwordResetToken).toBeDefined()

        expect(validate(passwordResetToken.toString())).toBeTruthy()
    })

    it('Should throw an error when password reset token is invalid', () => {
        expect(() => PasswordResetToken.fromString('invalid-token')).toThrow(
            InvalidPasswordResetTokenError,
        )
    })

    it('Should be able to compare with another password reset token', () => {
        const passwordResetTokenA = PasswordResetToken.generateToken()

        const passwordResetTokenB = PasswordResetToken.generateToken()

        const passwordResetTokenC = PasswordResetToken.fromString(passwordResetTokenA.toString())

        expect(passwordResetTokenA.equals(passwordResetTokenB)).toBeFalsy()
        expect(passwordResetTokenB.equals(passwordResetTokenA)).toBeFalsy()
        expect(passwordResetTokenA.equals(passwordResetTokenC)).toBeTruthy()
        expect(passwordResetTokenC.equals(passwordResetTokenA)).toBeTruthy()
        expect(passwordResetTokenB.equals(passwordResetTokenC)).toBeFalsy()
    })
})
