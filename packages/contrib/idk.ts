import type { Bot } from '../deps.ts';
import { commandAliases, commands, subCommands, Context } from '../framework/mod.ts';

type Callback = (guildId: bigint | undefined) => Promise<string>;

export const enableBiggerBrainCommandContext = (prefixFn: Callback) => (bot: Bot): Bot => {
    const { interactionCreate, messageCreate } = bot.events;

    bot.events.interactionCreate = async (bot, interaction) => {
        const prefix = await prefixFn(interaction.guildId);

        if (interaction.user.toggles.bot) {
            interactionCreate(bot, interaction);
            return;
        }

        const ctx = new Context(prefix, bot, undefined, interaction);
        const commandName = ctx.getCommandName();


        if (!commandName) {
            return;
        }

        /** important stuff */

        const [subCommandName] = ctx.options.getSubcommand(false) ?? [];

        if (subCommandName) {
            const [subCommand] = subCommands.get(`${commandName}/${subCommandName}`) ?? [];

            if (subCommand) {
                subCommand.run(ctx);
            }
        }

        const [command] = commands.get(commandName) ?? [];

        if (command) {
            command.run(ctx);
        }

        interactionCreate(bot, interaction);
    };

    bot.events.messageCreate = async (bot, message) => {
        const prefix = await prefixFn(message.guildId);

        if (message.isBot) {
            messageCreate(bot, message);
            return;
        }

        const ctx = new Context(prefix, bot, message, undefined);
        const commandName = ctx.getCommandName();

        if (!commandName) {
            return;
        }

        /** important stuff */

        const [subCommandName] = ctx.options.getSubcommand(false) ?? [];

        if (subCommandName) {
            const [subCommand] = subCommands.get(`${commandName}/${subCommandName}`) ?? [];

            if (subCommand) {
                subCommand.run(ctx);
            }
        }

        const [command] = commands.get(commandName) ?? commands.get(commandAliases.get(commandName) ?? '') ?? [];

        if (command) {
            command.run(ctx);
        }

        messageCreate(bot, message);
    };

    return bot;
};
