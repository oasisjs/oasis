import type { BotWithCache, Context, User } from '../../deps.ts';
import { Argument, Command } from '../../deps.ts';

@Command
export class Avatar {
    readonly data = {
        name: 'avatar',
        description: 'Get the avatar of a user',
    };

    readonly aliases = ['pfp', 'avy', 'icon'];

    @Argument.User('The user to get the avatar of')
    declare user: User;

    get options(): unknown[] {
        return [this.user];
    }

    async run(ctx: Context<BotWithCache>) {
        const userId = ctx.options.getUser(0) ?? ctx.options.getUser('user') ?? ctx.userId;

        if (!userId) {
            return;
        }

        const user = ctx.bot.users.get(userId) ?? (await ctx.bot.helpers.getUser(userId));

        if (!user) {
            await ctx.respond({ with: 'Unkown user' });
            return;
        }

        const avatar = ctx.bot.helpers.avatarURL(user.id, user.discriminator, {
            size: 2048,
            avatar: user.avatar,
        });

        await ctx.respond({ with: avatar });
    }
}
