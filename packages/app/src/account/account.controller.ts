import { Body, Controller, HttpException, HttpStatus, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
    CantVerifyEmailError,
    InvalidAccountNameError,
    InvalidEmailAddressError,
    InvalidEmailVerificationTokenError,
    InvalidPasswordError,
} from '@ts-api-example/core'
import { AccountSignupPost } from './account-signup-post.decorator'
import { AccountService } from './account.service'
import { CreateAccountDto, VerifyEmailDto } from './dto'

@ApiTags('Account')
@Controller('account')
export class AccountController {
    constructor(private readonly service: AccountService) {}

    @AccountSignupPost()
    public async signup(@Body() requestBody: CreateAccountDto) {
        return await AccountController.handleSignupRequest(
            async () => await this.service.createAccount(requestBody),
        )
    }

    @Patch('verify-email')
    public async verifyEmail(@Body() requestBody: VerifyEmailDto) {
        return await AccountController.handleVerifyEmailRequest(
            async () => await this.service.verifyEmailAddress(requestBody),
        )
    }

    private static async handleSignupRequest(serviceMethod: () => Promise<void>) {
        try {
            await serviceMethod()

            return {
                status: 201,
                data: {},
            }
        } catch (error) {
            if (
                error instanceof InvalidAccountNameError ||
                error instanceof InvalidEmailAddressError ||
                error instanceof InvalidPasswordError
            ) {
                throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY, {
                    cause: error,
                    description: 'Unprocessable Entity',
                })
            } else {
                throw new HttpException(
                    'Oh, no! Something went wrong',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    {
                        cause: error,
                        description: 'Houston, we have a problem',
                    },
                )
            }
        }
    }

    private static async handleVerifyEmailRequest(serviceMethod: () => Promise<void>) {
        try {
            await serviceMethod()

            return {
                status: 200,
                data: {},
            }
        } catch (error) {
            if (
                error instanceof InvalidEmailAddressError ||
                error instanceof InvalidEmailVerificationTokenError
            ) {
                throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY, {
                    cause: error,
                    description: 'Unprocessable Entity',
                })
            } else if (error instanceof CantVerifyEmailError) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
                    cause: error,
                    description:
                        'The provided token does not match any active email verification requests.',
                })
            } else {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, {
                    cause: error,
                    description: 'Houston, we have a problem',
                })
            }
        }
    }
}
