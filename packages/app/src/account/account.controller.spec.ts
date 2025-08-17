import {CacheModule} from '@nestjs/cache-manager'
import {ConfigModule} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'
import {Test, TestingModule} from '@nestjs/testing'
import {AccountController} from './account.controller'
import {AccountService} from './account.service'
import {InMemoryAccountRepository} from './repository'

describe('AccountController', () => {
    let controller: AccountController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                JwtModule.register({}),
                CacheModule.register(),
            ],
            controllers: [AccountController],
            providers: [
                {
                    provide: AccountService,
                    useValue: new AccountService(
                        new InMemoryAccountRepository()
                    ),
                },
            ],
        }).compile()

        controller = module.get<AccountController>(AccountController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()

        expect(controller).toBeInstanceOf(AccountController)
    })

    it('should be able to do an account sign up', async () => {
        const requestBody = {
            name: 'John Doe',
            email: 'john.doe@email.com',
            password: 'JohnDoe123!@#',
        }

        const result = await controller.signup(requestBody)
        expect(result).toBeDefined()
    })

    it('should be return an http exception when try to create an account with invalid data', async () => {
        const requestBody = {
            name: '',
            email: 'john.doe@email.com*ASDF*',
            password: 'JohnDoe123!@#',
        }

        await expect(controller.signup(requestBody)).rejects.toMatchObject({
            status: 422,
        })
    })
})
