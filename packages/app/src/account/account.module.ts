import {Module} from '@nestjs/common'
import {AccountRepository} from '@ts-api-example/core'
import {AccountController} from './account.controller'
import {AccountService} from './account.service'
import {InMemoryAccountRepository} from './repository'

@Module({
    controllers: [AccountController],
    providers: [
        {
            provide: AccountService,
            useFactory: (repository: AccountRepository) =>
                new AccountService(repository),
            inject: [InMemoryAccountRepository],
        },
        InMemoryAccountRepository,
    ],
})
export class AccountModule {}
