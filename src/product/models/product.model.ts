import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum Tag {
	Available = 'available',
	ToOrder = 'to_order',
	Discounts = 'discounts',
	NotAvailable = 'not_available',
}

export class Size {
	@prop()
	value: number;

	@prop()
	unit: string;
}

export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps {
	@prop({ type: () => [String] })
	photos: string[];

	@prop()
	title: string;

	@prop()
	price: number;

	@prop({ default: 0 })
	discounts: number;

	@prop()
	quantity: number;

	@prop({ enum: () => Tag })
	tag: Tag;

	@prop({ default: true })
	new: boolean;

	@prop({ default: false })
	popular: boolean;

	@prop({ type: () => Size, _id: false })
	size: Size;
}
