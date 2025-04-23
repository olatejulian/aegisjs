import {Account, AccountFactory} from '@core/account'

describe('Account Factory Unit Tests', () => {
    it('should be able to create an account from primitives values', async () => {
        const accountNameString = 'John Doe'

        const emailAddressString = 'john.doe@email.com'

        const passwordString = 'MyPasswordWith!@#And123'

        const account = await AccountFactory.createAccount({
            name: accountNameString,
            emailAddress: emailAddressString,
            password: passwordString,
        })

        expect(account).toBeDefined()

        expect(account).toBeInstanceOf(Account)

        expect(account.getName().toString()).toBe(accountNameString)

        expect(account.getEmailAddress().toString()).toBe(emailAddressString)

        expect(account.comparePassword(passwordString)).toBeTruthy()
    })
})
