import { ModuleMetadata } from '@nestjs/common';

export interface ISenderOptions {
	twilio: {
		accountSid: string;
		authToken: string;
		from: string;
	};
	telegram: {
		botId: string;
		chatId: string;
	};
}

export interface ISenderModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => ISenderOptions | Promise<ISenderOptions>;
	inject?: any[];
}
