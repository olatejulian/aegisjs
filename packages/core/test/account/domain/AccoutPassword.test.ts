// AccountPassword.spec.ts

import {
    AccountPassword,
    CannotGenerateResetTokenError,
    CannotResetPasswordError,
    Password,
    PasswordResetToken,
} from '@core/account'

describe('AccountPassword', () => {
    let oldPassword: Password
    let newPassword: Password
    let accountPassword: AccountPassword

    beforeEach(async () => {
        oldPassword = await Password.fromPlainString('Valid@Password123')

        newPassword = await Password.fromPlainString('New@Password456')

        accountPassword = AccountPassword.create(oldPassword)
    })

    it('should create an AccountPassword and convert to object', () => {
        const obj = accountPassword.toObject()

        expect(obj.password.toString()).toEqual(oldPassword.toString())

        expect(obj.passwordUpdatedAt).toBeUndefined()

        expect(obj.resetToken).toBeUndefined()

        expect(obj.tokenExpiresAt).toBeUndefined()
    })

    it('should verify correct plain password', async () => {
        expect(
            await accountPassword.verifyPlainPassword('Valid@Password123')
        ).toBe(true)
    })

    it('should verify incorrect plain password', async () => {
        expect(
            await accountPassword.verifyPlainPassword('WrongPassword')
        ).toBe(false)
    })

    it('should change password if old password matches', () => {
        accountPassword.changePassword(oldPassword, newPassword)

        const obj = accountPassword.toObject()

        expect(obj.password.toString()).toEqual(newPassword.toString())

        expect(obj.passwordUpdatedAt).toBeInstanceOf(Date)

        expect(obj.resetToken).toBeNull()
    })

    it('should throw error if old password does not match', async () => {
        const wrongOld = await Password.fromPlainString('Wrong@Password123')

        expect(() =>
            accountPassword.changePassword(wrongOld, newPassword)
        ).toThrow(CannotResetPasswordError)
    })

    it('should generate a reset token if none exists or is expired', () => {
        const token = accountPassword.generateResetToken()

        const obj = accountPassword.toObject()

        expect(obj.resetToken?.toString()).toEqual(token.toString())

        expect(obj.tokenExpiresAt).toBeInstanceOf(Date)
    })

    it('should throw error if reset token already exists and is not expired', () => {
        accountPassword.generateResetToken()

        expect(() => accountPassword.generateResetToken()).toThrow(
            CannotGenerateResetTokenError
        )
    })

    it('should reset password with valid token and update metadata', () => {
        const token = accountPassword.generateResetToken()

        accountPassword.resetPassword(newPassword, token)

        const obj = accountPassword.toObject()

        expect(obj.password.toString()).toEqual(newPassword.toString())

        expect(obj.passwordUpdatedAt).toBeInstanceOf(Date)

        expect(obj.resetToken).toBeNull()

        expect(obj.tokenExpiresAt).toBeNull()
    })

    it('should throw error when token is invalid', () => {
        accountPassword.generateResetToken()

        const invalidToken = PasswordResetToken.generateToken()

        expect(() =>
            accountPassword.resetPassword(newPassword, invalidToken)
        ).toThrow(CannotResetPasswordError)
    })

    it('should throw error when token is expired', () => {
        const token = accountPassword.generateResetToken()

        const obj = accountPassword.toObject()

        const expiredDate = new Date(Date.now() - 1000)
        
        const expiredAccount = AccountPassword.fromObject({
            ...obj,
            tokenExpiresAt: expiredDate,
        })

        expect(() => expiredAccount.resetPassword(newPassword, token)).toThrow(
            CannotResetPasswordError
        )
    })
})
