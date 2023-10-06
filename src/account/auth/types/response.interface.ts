export interface Response {
	cookie: (
		key: string,
		value: string,
		options?: Record<string, string | number | boolean>,
	) => void;
	clearCookie: (key: string) => void;
}
