import { ModuleMetadata } from '@nestjs/common';

export interface ISenderOptions {
	telegram: {
		botId: string;
		chatId: string;
	};
}

export interface ISenderModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => ISenderOptions | Promise<ISenderOptions>;
	inject?: any[];
}
