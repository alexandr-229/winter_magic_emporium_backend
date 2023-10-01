import { Module } from '@nestjs/common';
import { SenderModule } from 'src/sender/sender.module';
import { PaymentController } from './payment.controller';

@Module({
	imports: [SenderModule],
	controllers: [PaymentController],
})
export class PaymentModule {}
