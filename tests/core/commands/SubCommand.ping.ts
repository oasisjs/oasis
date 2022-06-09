import { type Context } from "../../deps.ts";
import { Argument as Option, Command } from "../../deps.ts";

export class Ping {
	readonly parent = "repl";

	@Option("Wheter to mention the user or not", true)
	declare mention: boolean;

	get options() {
		return [this.mention];
	}

	async run(ctx: Context) {
		const toMention = ctx.options.getBoolean(0) ?? ctx.options.getBoolean("mention", true);
		console.log("result of Ping:", toMention);
		await ctx.respond({ with: `Ping! ${toMention ? `<@${ctx.userId}>` : ""}` });
	}
}