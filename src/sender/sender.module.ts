import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { SENDER_MODULE_OPTIONS } from './sender.const';
import { SenderService } from './sender.service';
import { ISenderModuleAsyncOptions } from './types/options';

@Global()
@Module({})
export class SenderModule {
	static forRootAsync(option: ISenderModuleAsyncOptions): DynamicModule {
		const asyncOptions = this.createAsyncOptionsProvider(option);
		return {
			imports: option.imports,
			module: SenderModule,
			providers: [SenderService, asyncOptions],
			exports: [SenderService],
		};
	}

	private static createAsyncOptionsProvider(options: ISenderModuleAsyncOptions): Provider {
		return {
			provide: SENDER_MODULE_OPTIONS,
			useFactory: async (...args: any[]) => {
				const config = await options.useFactory(...args);
				return config;
			},
			inject: options.inject || [],
		};
	}
}
