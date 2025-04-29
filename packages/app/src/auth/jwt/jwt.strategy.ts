import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {JwtCurrentUser} from './jwt-current-user.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('AUTH_JWT_TOKEN_SECRET'),
        })
    }

    public async validate(payload: {sub: string}): Promise<JwtCurrentUser> {
        return {emailAddress: payload.sub}
    }
}
