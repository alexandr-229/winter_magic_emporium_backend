import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	const { user } = ctx.switchToHttp().getRequest();
	return user;
});
