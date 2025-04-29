import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import {Request} from 'express'
import {AuthService} from '../auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()

        const authHeader = request.headers['authorization']

        const bearerString = 'Bearer '

        if (!(authHeader && authHeader.startsWith(bearerString)))
            throw new UnauthorizedException()

        const accessToken = authHeader.replace(bearerString, '').trim()

        try {
            const emailAddress =
                await this.authService.getEmailAddressFromAccessToken(
                    accessToken
                )

            request['user'] = {emailAddress: emailAddress}
        } catch (e) {
            throw new UnauthorizedException(e)
        }

        return true
    }
}
