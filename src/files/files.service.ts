import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { format } from 'date-fns';
import { File } from './types/file';

@Injectable()
export class FilesService {
	async uploadFile(files: File[]) {
		const paths: string[] = [];
		const date = format(new Date(), 'yyyy-dd-MM');
		const folderName = 'uploads';
		const dirPath = `${path}/${folderName}/${date}`;

		await ensureDir(dirPath);

		for (const file of files) {
			const time = format(new Date(), 'hh:mm:ss.SSS');
			const filePath = `${dirPath}/${time}-${file.originalname}`;
			const absolutePath = `/${folderName}/${time}-${file.originalname}`;

			await writeFile(filePath, file.buffer);

			paths.push(absolutePath);
		}

		return paths;
	}
}
