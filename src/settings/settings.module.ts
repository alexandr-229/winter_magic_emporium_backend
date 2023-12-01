import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';

@Module({
	imports: [ConfigModule],
	controllers: [SettingsController],
	providers: [SettingsService],
})
export class SettingsModule {}
