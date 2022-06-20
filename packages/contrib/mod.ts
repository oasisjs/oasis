import type { Bot } from '../deps.ts';
import { commandAliases, commands, Context, subCommands, subCommandGroups } from '../framework/mod.ts';

/** represents an asyncronous prefix lookup */
type PrefixCallback = (guildId: bigint | undefined) => Promise<string>;

// deno-fmt-ignore
export const enableCommandContext = (prefix: string) => (bot: Bot): Bot => {
    const { interactionCreate, messageCreate } = bot.events;

    bot.events.interactionCreate = (bot, interaction) => {
        if (interaction.user.toggles.bot) {
            interactionCreate(bot, interaction);
            return;
        }

        const ctx = new Context(prefix, bot, undefined, interaction);
        const commandName = ctx.getCommandName();

        if (!commandName) {
            return;
        }

        const [command] = commands.get(commandName) ?? [];

        if (command) {
            command.run(ctx);
        }

        interactionCreate(bot, interaction);
    };

    bot.events.messageCreate = (bot, message) => {
        if (message.isBot) {
            messageCreate(bot, message);
            return;
        }

        const ctx = new Context(prefix, bot, message, undefined);
        const commandName = ctx.getCommandName();

        if (!commandName) {
            return;
        }

        const [command] = commands.get(commandName) ?? commands.get(commandAliases.get(commandName) ?? '') ?? [];

        if (command) {
            command.run(ctx);
        }

        messageCreate(bot, message);
    };

    return bot;
};

// deno-fmt-ignore
export const enableCommandContextWithCustomPrefix = (prefixFn: PrefixCallback) => (bot: Bot) => {
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

        const [command] = commands.get(commandName) ?? commands.get(commandAliases.get(commandName) ?? '') ?? [];

        if (command) {
            command.run(ctx);
        }

        messageCreate(bot, message);
    };

    return bot;
};

// deno-fmt-ignore
export const enableBigBrainCommandContext = (prefix: string) => (bot: Bot): Bot => {
    const { interactionCreate, messageCreate } = bot.events;

    bot.events.interactionCreate = (bot, interaction) => {
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

        const [subCommandName] = ctx.options.getSubCommand(false) ?? [];

        if (subCommandName) {
            const [subCommand] = subCommands.get(`${commandName}/${subCommandName}`) ?? [];

            if (subCommand) {
                subCommand.run(ctx);
            }
            else {
                const [subCommandGroupName] = ctx.options.getSubCommandGroup(false) ?? [];

                const [subCommandFromGroup] = subCommandGroups.get(`${commandName}/${subCommandGroupName}/${subCommandName}`) ?? [];

                if (subCommandFromGroup) {
                    subCommandFromGroup.run(ctx);
                }
            }
        }

        const [command] = commands.get(commandName) ?? [];

        if (command) {
            command.run(ctx);
        }

        interactionCreate(bot, interaction);
    };

    bot.events.messageCreate = (bot, message) => {
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

        const [subCommandName] = ctx.options.getSubCommand(false) ?? [];

        if (subCommandName) {
            const [subCommand] = subCommands.get(`${commandName}/${subCommandName}`) ?? [];

            if (subCommand) {
                subCommand.run(ctx);
            }
            else {
                const [subCommandGroupName] = ctx.options.getSubCommandGroup(false) ?? [];

                const [subCommandFromGroup] = subCommandGroups.get(`${commandName}/${subCommandGroupName}/${subCommandName}`) ?? [];

                if (subCommandFromGroup) {
                    subCommandFromGroup.run(ctx);
                }
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

// deno-fmt-ignore
export const enableBiggerBrainCommandContext = (prefixFn: PrefixCallback) => (bot: Bot): Bot => {
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

        const [subCommandName] = ctx.options.getSubCommand(false) ?? [];

        if (subCommandName) {
            const [subCommand] = subCommands.get(`${commandName}/${subCommandName}`) ?? [];

            if (subCommand) {
                subCommand.run(ctx);
            }
            else {
                const [subCommandGroupName] = ctx.options.getSubCommandGroup(false) ?? [];

                const [subCommandFromGroup] = subCommandGroups.get(`${commandName}/${subCommandGroupName}/${subCommandName}`) ?? [];

                if (subCommandFromGroup) {
                    subCommandFromGroup.run(ctx);
                }
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

        const [subCommandName] = ctx.options.getSubCommand(false) ?? [];

        if (subCommandName) {
            const [subCommand] = subCommands.get(`${commandName}/${subCommandName}`) ?? [];

            if (subCommand) {
                subCommand.run(ctx);
            }
            else {
                const [subCommandGroupName] = ctx.options.getSubCommandGroup(false) ?? [];

                const [subCommandFromGroup] = subCommandGroups.get(`${commandName}/${subCommandGroupName}/${subCommandName}`) ?? [];

                if (subCommandFromGroup) {
                    subCommandFromGroup.run(ctx);
                }
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
