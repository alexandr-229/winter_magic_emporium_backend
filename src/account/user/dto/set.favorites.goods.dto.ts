import { IsEnum, IsString } from 'class-validator';

export enum FavoritesGoodsActions {
	Delete = 'Delete',
	Add = 'Add',
}

export class SetFavoritesGoodsDto {
	@IsEnum(FavoritesGoodsActions)
	action: FavoritesGoodsActions;

	@IsString()
	productId: string;
}
