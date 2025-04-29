import {Body, Controller, HttpException, HttpStatus} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'
import {
    InvalidAccountNameError,
    InvalidEmailAddressError,
    InvalidPasswordError,
} from '@ts-api-example/core'
import {AccountSignupPost} from './account-signup-post.decorator'
import {AccountService} from './account.service'
import {CreateAccountDto} from './dto'

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly service: AccountService) {}

    @AccountSignupPost()
    public async signup(@Body() requestBody: CreateAccountDto) {
        return await this.handleSignupRequest(
            async () => await this.service.createAccount(requestBody)
        )
    }

    private async handleSignupRequest(serviceMethod: () => Promise<void>) {
        try {
            await serviceMethod()

            return {
                status: 201,
                data: {},
            }
        } catch (error: any) {
            if (
                error instanceof InvalidAccountNameError ||
                error instanceof InvalidEmailAddressError ||
                error instanceof InvalidPasswordError
            ) {
                throw new HttpException(
                    error.message,
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    {
                        cause: error,
                        description: 'Unprocessable Entity',
                    }
                )
            } else {
                throw new HttpException(
                    'Oh, no! Something went wrong',
                    HttpStatus.BAD_REQUEST,
                    {
                        cause: error,
                        description: 'Houston, we have a problem',
                    }
                )
            }
        }
    }
}
