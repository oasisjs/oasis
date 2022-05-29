import type { Bot, Interaction, InteractionApplicationCommandCallbackData } from '../../deps.ts';
import type { CreateCommand } from './CreateCommand.ts';
import { InteractionResponseTypes } from '../../deps.ts';

/**
 * Context class for interactions
 */
export class InteractionContext<T extends Bot = Bot> {
    bot: T;
    interaction: Interaction;

    constructor(bot: T, interaction: Interaction) {
        this.interaction = interaction;
        this.bot = bot;

        Object.defineProperty(this, 'bot', { enumerable: false, writable: false, value: bot });
    }

    async respond(data: CreateCommand) {
        const parsed: InteractionApplicationCommandCallbackData = {
            // pass
        };

        if ('embeds' in data) {
            parsed.embeds = data.embeds.map((e) => e.toJSON());
        } else if (typeof data.with === 'string') {
            parsed.content = data.with;
        } else if (Array.isArray(data.with)) {
            parsed.embeds = data.with.map((e) => e.toJSON());
        } else if (!data.with) {
            parsed.content = undefined;
        } else {
            parsed.embeds = [data.with.toJSON()];
        }

        const m = await this.bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
            type: 'type' in data ? data.type : InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                ...parsed,
                flags: 'private' in data && data.private ? 64 : undefined,
                allowedMentions: 'mentions' in data ? data.mentions : undefined,
                tts: 'tts' in data ? data.tts : undefined,
                file: 'files' in data ? data.files : undefined,
            },
        });

        return m;
    }
}
