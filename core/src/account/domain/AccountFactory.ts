import {Account, AccountEmail, AccountPassword} from './entity'
import {AccountName, EmailAddress, Password} from './value-object'

export class AccountFactory {
    public static async createAccount(props: {
        name: string
        emailAddress: string
        password: string
    }): Promise<Account> {
        const accountName = AccountName.create(props.name)

        const emailAddress = EmailAddress.create(props.emailAddress)

        const password = await Password.fromPlainString(props.password)

        const accountEmail = AccountEmail.create(emailAddress)

        const accountPassword = AccountPassword.create(password)

        const account = Account.create(
            accountName,
            accountEmail,
            accountPassword
        )

        return account
    }
}
