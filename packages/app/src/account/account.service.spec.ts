import {Test, TestingModule} from '@nestjs/testing'
import {AccountService} from './account.service'
import {CreateAccountDto} from './dto'
import {InMemoryAccountRepository} from './repository'

describe('Account Service Test Suite', () => {
    let service: AccountService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AccountService,
                    useValue: new AccountService(
                        new InMemoryAccountRepository()
                    ),
                },
            ],
        }).compile()

        service = module.get<AccountService>(AccountService)
    })

    it('should be able to instance an Account Service', async () => {
        expect(service).toBeDefined()

        expect(service).toBeInstanceOf(AccountService)
    })

    it('should be able to create an account from valid data', async () => {
        const createAccountDto = new CreateAccountDto({
            name: 'John Doe',
            email: 'john.doe@email.com',
            password: 'JohnDoe123!@#',
        })

        await service.createAccount(createAccountDto)
    })
})
