import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

console.log(path);

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: path,
		}),
	],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}
