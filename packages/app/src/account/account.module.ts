import {Module} from '@nestjs/common'
import {AccountController} from './account.controller'
import {AccountService} from './account.service'
import {InMemoryAccountRepository} from './repository'

@Module({
    controllers: [AccountController],
    providers: [AccountService, InMemoryAccountRepository],
})
export class AccountModule {}
