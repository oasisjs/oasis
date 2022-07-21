import type { Session } from '../../deps.ts';
import {
    commandAliases,
    commands,
    Context,
    InteractionContext,
    MessageContext,
    subCommandGroups,
    subCommands,
} from '../framework/mod.ts';

/** represents an asyncronous prefix lookup */
type PrefixCallback = (guildId: bigint | undefined) => Promise<string>;

// deno-fmt-ignore
export const enableCommandContext = (prefix: string) => (session: Session): Session => {
    session.on("interactionCreate", (interaction) => {
        if (interaction.user?.bot) {
            return;
        }

        if (!interaction.isCommand()) {
            return;
        }

        const ctx = new InteractionContext(session, interaction);
        const commandName = interaction.commandName;

        if (!commandName) {
            return;
        }

        const [command] = commands.get(commandName) ?? [];

        if (command) {
            command.run(ctx);
        }
    });

    session.on("messageCreate", (message) => {
        if (message.isWebhookMessage() || message.author?.bot) {
            return;
        }

        const ctx = new MessageContext(session, message, prefix);
        const commandName = ctx.commandN;

        if (!commandName) {
            return;
        }

        const [command] = commands.get(commandName) ?? commands.get(commandAliases.get(commandName) ?? '') ?? [];

        if (command) {
            command.run(ctx);
        }
    });

    return session;
};
