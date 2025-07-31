// AccountPassword.spec.ts

import {
    AccountPasswordManager,
    CannotGenerateResetTokenError,
    CannotResetPasswordError,
    Password,
    PasswordResetToken,
} from '@core/account'

describe('Account Password Manager Unit Tests', () => {
    let oldPassword: Password
    let newPassword: Password
    let accountPasswordManager: AccountPasswordManager

    beforeEach(async () => {
        oldPassword = await Password.fromPlainString('Valid@Password123')

        newPassword = await Password.fromPlainString('New@Password456')

        accountPasswordManager = AccountPasswordManager.create(oldPassword)
    })

    it('should create an AccountPasswordManager and convert to object', () => {
        const obj = accountPasswordManager.toObject()

        expect(obj.password.toString()).toEqual(oldPassword.toString())

        expect(obj.passwordUpdatedAt).toBeUndefined()

        expect(obj.resetToken).toBeUndefined()

        expect(obj.tokenExpiresAt).toBeUndefined()
    })

    it('should verify correct plain password', async () => {
        expect(
            await accountPasswordManager.comparePassword('Valid@Password123')
        ).toBe(true)
    })

    it('should verify incorrect plain password', async () => {
        expect(
            await accountPasswordManager.comparePassword('WrongPassword')
        ).toBe(false)
    })

    it('should change password if old password matches', () => {
        accountPasswordManager.changePassword(oldPassword, newPassword)

        const obj = accountPasswordManager.toObject()

        expect(obj.password.toString()).toEqual(newPassword.toString())

        expect(obj.passwordUpdatedAt).toBeInstanceOf(Date)

        expect(obj.resetToken).toBeNull()
    })

    it('should throw error if old password does not match', async () => {
        const wrongOld = await Password.fromPlainString('Wrong@Password123')

        expect(() =>
            accountPasswordManager.changePassword(wrongOld, newPassword)
        ).toThrow(CannotResetPasswordError)
    })

    it('should generate a reset token if none exists or is expired', () => {
        const token = accountPasswordManager.generateResetToken()

        const obj = accountPasswordManager.toObject()

        expect(obj.resetToken?.toString()).toEqual(token.toString())

        expect(obj.tokenExpiresAt).toBeInstanceOf(Date)
    })

    it('should throw error if reset token already exists and is not expired', () => {
        accountPasswordManager.generateResetToken()

        expect(() => accountPasswordManager.generateResetToken()).toThrow(
            CannotGenerateResetTokenError
        )
    })

    it('should reset password with valid token and update metadata', () => {
        const token = accountPasswordManager.generateResetToken()

        accountPasswordManager.resetPassword(newPassword, token)

        const obj = accountPasswordManager.toObject()

        expect(obj.password.toString()).toEqual(newPassword.toString())

        expect(obj.passwordUpdatedAt).toBeInstanceOf(Date)

        expect(obj.resetToken).toBeNull()

        expect(obj.tokenExpiresAt).toBeNull()
    })

    it('should throw error when token is invalid', () => {
        accountPasswordManager.generateResetToken()

        const invalidToken = PasswordResetToken.generateToken()

        expect(() =>
            accountPasswordManager.resetPassword(newPassword, invalidToken)
        ).toThrow(CannotResetPasswordError)
    })

    it('should throw error when token is expired', () => {
        const token = accountPasswordManager.generateResetToken()

        const obj = accountPasswordManager.toObject()

        const expiredDate = new Date(Date.now() - 1000)

        const expiredAccount = AccountPasswordManager.fromObject({
            ...obj,
            tokenExpiresAt: expiredDate,
        })

        expect(() => expiredAccount.resetPassword(newPassword, token)).toThrow(
            CannotResetPasswordError
        )
    })
})
