import type { Bot } from '../deps.ts';
import { commands, commandAliases, Context } from '../framework/mod.ts';

export const enableCommandContext = (prefix: string) => (bot: Bot) => {
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
};