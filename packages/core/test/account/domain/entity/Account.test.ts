import {
    Account,
    AccountEmail,
    AccountName,
    AccountPassword,
    EmailAddress,
    EmailVerificationToken,
    Password,
} from '@core/account'

describe('Account unit tests', () => {
    let account: Account
    let accountEmail: AccountEmail
    let accountName: AccountName
    let accountPassword: AccountPassword
    let emailAddress: EmailAddress
    let password: Password

    beforeEach(async () => {
        account = null

        accountName = AccountName.create('John Doe')

        emailAddress = EmailAddress.create('john.doe@email.com')

        password = await Password.fromPlainString('MyPasswordWith!@#And123')

        accountEmail = AccountEmail.create(emailAddress)

        accountPassword = AccountPassword.create(password)

        account = Account.create(accountName, accountEmail, accountPassword)
    })

    it('should be able to return the properties used to create the instance of the account', async () => {
        expect(account).toBeDefined()

        expect(account).toBeInstanceOf(Account)

        expect(account.getId()).toBeDefined()

        expect(account.getName()).toEqual(accountName)

        expect(account.getEmailAddress()).toEqual(emailAddress)
    })

    it('should be able to change the account name', () => {
        const newName = AccountName.create('John Angstrom Doe')

        expect(account.getName().equals(accountName)).toBeTruthy()

        expect(account.getName().equals(newName)).toBeFalsy()

        account.changeName(newName)

        expect(account.getName().equals(newName)).toBeTruthy()
    })

    it('should be able to generate a email verification token and verify the email address', () => {
        const token = account.generateEmailVerificationToken()

        expect(token).toBeDefined()

        expect(token).toBeInstanceOf(EmailVerificationToken)

        expect(account.isEmailVerified()).toBeFalsy()

        account.verifyEmail(token)

        expect(account.isEmailVerified()).toBeTruthy()
    })

    it('should be able to change the password', async () => {
        const oldPassword = password

        const newPassword = await Password.fromPlainString(
            'MyNewPassword123!@#'
        )

        expect(
            account.toObject().password.toObject().password.equals(oldPassword)
        ).toBeTruthy()

        expect(
            account.toObject().password.toObject().password.equals(newPassword)
        ).toBeFalsy()

        account.changePassword(oldPassword, newPassword)

        expect(
            account.toObject().password.toObject().password.equals(oldPassword)
        ).toBeFalsy()

        expect(
            account.toObject().password.toObject().password.equals(newPassword)
        ).toBeTruthy()
    })

    it('should be able to generate a password reset token and reset the password', async () => {
        const newPassword = await Password.fromPlainString(
            'MyNewPassword123!@#'
        )

        const token = account.generatePasswordResetToken()

        account.resetPassword(newPassword, token)

        expect(
            account.toObject().password.toObject().password.equals(newPassword)
        ).toBeTruthy()
    })
})
