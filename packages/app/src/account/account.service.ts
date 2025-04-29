import {Injectable} from '@nestjs/common'
import {AccountFactory, AccountRepository} from '@ts-api-example/core'
import {CreateAccountDto} from './dto'

@Injectable()
export class AccountService {
    constructor(private readonly repository: AccountRepository) {}

    public async createAccount(
        createAccountDto: CreateAccountDto
    ): Promise<void> {
        const {name, email: emailAddress, password} = createAccountDto

        const account = await AccountFactory.createAccount({
            name,
            emailAddress,
            password,
        })

        await this.repository.save(account)
    }
}
