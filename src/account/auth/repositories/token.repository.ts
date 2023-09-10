import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TokenModel } from '../models/token.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class TokenRepository {
	constructor(@InjectModel(TokenModel) private readonly tokenModel: ModelType<TokenModel>) {}

	async createToken(refreshToken: string, userEmail: string) {
		const result = await this.tokenModel.create({ refreshToken, userEmail });
		return result;
	}

	async getToken(email: string) {
		const result = await this.tokenModel.findOne({ userEmail: email }).exec();
		return result;
	}

	async updateToken(userEmail: string, refreshToken: string) {
		const result = await this.tokenModel
			.updateOne({ userEmail }, { $set: { refreshToken } }, { new: true })
			.exec();
		return result;
	}
}
