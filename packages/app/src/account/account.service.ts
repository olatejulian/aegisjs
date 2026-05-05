import { Injectable } from '@nestjs/common'
import {
    AccountFactory,
    AccountRepository,
    EmailAddress,
    EmailVerificationToken,
} from '@ts-api-example/core'
import { CreateAccountDto, VerifyEmailDto } from './dto'

@Injectable()
export class AccountService {
    constructor(private readonly repository: AccountRepository) {}

    public async createAccount(createAccountDto: CreateAccountDto): Promise<void> {
        const { name, email: emailAddress, password } = createAccountDto

        const account = await AccountFactory.createAccount({
            name,
            emailAddress,
            password,
        })

        await this.repository.save(account)
    }

    public async verifyEmailAddress(dto: VerifyEmailDto): Promise<void> {
        const { emailAddress: emailAddressString, verificationToken: verificationTokenString } = dto

        const emailAddress = EmailAddress.create(emailAddressString)

        const account = await this.repository.findByEmail(emailAddress)

        if (!account) return

        const verificationToken = EmailVerificationToken.fromString(verificationTokenString)

        account.verifyEmailAddress(verificationToken)

        await this.repository.save(account)
    }
}
