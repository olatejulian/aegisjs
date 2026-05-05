import { applyDecorators, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
    CreateAccount201Response,
    CreateAccount400Response,
    CreateAccount422Response,
} from './account.response'
import { CreateAccountDto } from './dto'

export function AccountSignupPost() {
    return applyDecorators(
        Post('signup'),
        ApiTags('Public Routes'),
        ApiBody({ type: CreateAccountDto }),
        ApiResponse({
            status: HttpStatus.CREATED,
            description: 'Account created successfully',
            type: CreateAccount201Response,
        }),
        ApiResponse({
            status: HttpStatus.BAD_REQUEST,
            description: 'Oh, no! Something went wrong',
            type: CreateAccount400Response,
        }),
        ApiResponse({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            description: 'Schema validation failed',
            type: CreateAccount422Response,
        }),
    )
}
