import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CartModule } from 'src/cart/cart.module';
import { UserModule } from 'src/account/user/user.module';

@Module({
	imports: [CartModule, UserModule],
	controllers: [PaymentController],
	providers: [PaymentService],
})
export class PaymentModule {}
