# Oasis

<img align="right" src="https://raw.githubusercontent.com/oasisjs/oasis/main/assets/oasis.png" alt="oasis"/>

Bleeding edge object oriented Discordeno framework for creating bots Oasis is minimal by design and it does not ship any
cache layer so you can implement your own

**Oasis is written Fully in typescript**

## Efficient & Cross-platform

Oasis is based on Discordeno, a lightweight Discord library for building mostly big Discord bots Since Discordeno is
cross platform Oasis ships a Node version by default which is a lot more bleeding-edge! `npm install oasis-framework`

## Creating commands with Deno

Oasis makes it easier to write commands that work on both messages and interactions Oasis avoids the use inheriterance
and prefers composition and middlewares

```ts
import { Argument, Command, Context } from 'oasis'

// define responses
const responses = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes, definitely',
	'You may rely on it',
	'Most likely',
	'Outlook good',
	'Yes'
]

@Command
class EightBall {
	readonly data = {
		name: `${responses.length}ball`,
		description: 'Ask the magic 8ball a question'
	}

	readonly aliases = ['ball']

	@Argument('The question', true)
	declare question: string // it works without 'declare' if you compile down to ES2020

	// get all options
	get options(): unknown[] {
		return [this.question] // first argument in the command
	}

	async run(ctx: Context) {
		const question =
			ctx.options.getString(0) ?? ctx.options.getString('question')
		const response = responses[Math.floor(Math.random() * responses.length)]

		if (question) {
			await ctx.respond({
				with: `Question: ${question} | Reply: ${response}`
			})
		}
	}
}
```

Oasis is minimal by design, so you can make your own Context class that suits your needs.

## Installation

Deno: `deno cache https://deno.land/x/oasis/mod.ts` Node: `npm install oasis-framework`

## Useful resources

-   the [Discordeno](https://github.com/discordeno/discordeno) library and [website](https://discordeno.mod.land/)
-   the Discordeno [Discord server](https://discord.gg/ddeno) so you can ask me for help
-   Cache layer for Discordeno https://github.com/discordeno/discordeno/blob/main/plugins/cache
-   Bot using the Oasis framework (not released yet) https://github.com/yuzudev/akebi

### TODO's:

-   adding more builders
-   make a CLI

### Changelog:

#### 2.0.0

-   Refactor the entire codebase
-   better support for Subcommands
-   Testing
-   2 new contrib/ files
-   [bug fix](https://github.com/yuzudev/oasis/issues/2#issue-1264940912)

#### 1.6.X

-   hotfixes and new contrib file

#### 1.5.X

-   new contrib file
-   bug fixes

#### 1.4.X

-   remove the need for an id when instantiating a bot
-   add the OasisClient class
-   latest bleeding edge version of Discordeno (rc45)

#### 1.3.X

-   remove dead code
-   latest bleeding edge version of Discordeno (rc39)

#### 1.2.X

-   remove the logger plugin
