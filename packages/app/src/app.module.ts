import {CacheModule} from '@nestjs/cache-manager'
import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {EventEmitterModule} from '@nestjs/event-emitter'
import {AccountModule} from './account/account.module'
import {AuthModule} from './auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: () => ({
                ttl: 10,
                max: 1000,
            }),
        }),
        EventEmitterModule.forRoot(),
        AccountModule,
        AuthModule,
    ],
})
export class AppModule {}
