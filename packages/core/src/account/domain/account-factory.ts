import {Account, AccountEmailManager, AccountPasswordManager} from './entity'
import {AccountName, EmailAddress, Password} from './value-object'

export class AccountFactory {
    public static async createAccount(props: {
        name: string
        emailAddress: string
        password: string
    }): Promise<Account> {
        const {
            name: accountNameString,
            emailAddress: emailAddressString,
            password: plainPasswordString,
        } = props

        const accountName = AccountName.create(accountNameString)

        const emailAddress = EmailAddress.create(emailAddressString)

        const password = await Password.fromPlainString(plainPasswordString)

        const accountEmailManager = AccountEmailManager.create(emailAddress)

        const accountPasswordManager = AccountPasswordManager.create(password)

        const account = Account.create(
            accountName,
            accountEmailManager,
            accountPasswordManager
        )

        return account
    }
}
