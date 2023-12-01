import { Types, isValidObjectId } from 'mongoose';

export function isObjectId(obj: unknown): obj is Types.ObjectId {
	return typeof obj === 'object' && isValidObjectId(obj);
}
