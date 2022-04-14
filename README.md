# Oasis
Bleeding edge object oriented Discordeno framework for creating bots
Oasis is minimal by design and it does not ships any cache layer so you can implement your own
Oasis is written Fully in typescript
Oasis is made in Deno https://deno.land/x/oasis@1.0.0/mod.ts

## Efficient & Cross-platform
Oasis is based on Discordeno, a lightweight Discord library for building mostly big Discord bots
Since Discordeno is cross platform Oasis ships a Node version by default which is a lot more bleeding-edge!
`npm install oasis-framework`

## Creating commands with Deno
Oasis makes it easier to write commands that work on both messages and interactions
Oasis avoids the use inheriterance and prefers composition and middlewares
```ts
import { Argument, Command, Context } from 'oasis';

// define responses
const responses = [ 'It is certain','It is decidedly so','Without a doubt','Yes, definitely','You may rely on it','Most likely','Outlook good','Yes'];

@Command
class EightBall {
    readonly data = {
        name: `${responses.length}ball`,
        description: 'Ask the magic 8ball a question',
    };

    readonly aliases = ['ball'];

    // declare string option 'question' as required
    @Argument('The question', true)
    declare question: string;

    // get all options
    get options(): unknown[] {
        return [this.question]; // first argument in the command
    }

    // run the command
    async run(ctx: Context) {
        const question = ctx.getString(0) ?? ctx.getString('question');
        const response = responses[Math.floor(Math.random() * responses.length)];

        if (question) {
        	await ctx.respond({ content: `Question: ${question} | Reply: ${response}` });
        }
    }
}
```

## How make a simple middleware to execute commands
Oasis is minimal by design, so you can make your own Context class that suits your needs
heres a minimal example of how to write a middleware (no typescript needed)
```ts
const PREFIX = "->";
const { interactionCreate, messageCreate } = bot.events;

bot.events.interactionCreate = (bot, interaction) => {
    if (interaction.user.toggles.bot) {
        interactionCreate(bot, interaction);
        return;
    }

    const ctx = new Context(PREFIX, bot, undefined, interaction);
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
        // if is bot forward the event
        messageCreate(bot, message);
        return;
    }

    // make sure to import Context from oasis
    const ctx = new Context(PREFIX, bot, message, undefined);
    const commandName = ctx.getCommandName();

    if (!commandName) {
        return;
    }

    // deno-fmt-ignore
    const [command] = commands.get(commandName) ?? commands.get(commandAliases.get(commandName) ?? '') ?? [];

    // check if command exists
    if (command) {
        command.run(ctx); // do not await so we can run commands "en paralelo"
    }

    messageCreate(bot, message);
};
```

## Installation
Deno: `deno cache https://deno.land/x/oasis@1.0.0/mod.ts`
Node: `npm install oasis-framework`

## Useful resources
* the [Discordeno](https://github.com/discordeno/discordeno) library and [website](https://discordeno.mod.land/)
* the [Discordeno](https://discord.com/invite/ddeno) Discord server so you can ask me for help
* Cache layer for Discordeno https://github.com/discordeno/discordeno/blob/main/plugins/cache
* Bot using the Oasis framework (not released yet) https://github.com/yuzudev/akebi

### TODO's:
* adding more builders
* make a CLI