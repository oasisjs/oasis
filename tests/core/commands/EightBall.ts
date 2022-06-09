import type { Context } from "../../deps.ts";
import { Argument, Command } from "../../deps.ts";

// define responses
const responses = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "Most likely",
    "Outlook good",
    "Yes",
];

@Command
export class EightBall {
    readonly data = {
        name: `${responses.length}ball`,
        description: "Ask the magic 8ball a question",
    };

    readonly aliases = ["ball"];

    // declare string option 'question' as required
    @Argument("The question", true)
    declare question: string;

    // get all options
    get options(): unknown[] {
        return [this.question];
    }

    // run the command
    async run(ctx: Context) {
        const question = ctx.options.getString(0) ?? ctx.options.getString("question");
        const response = responses[Math.floor(Math.random() * responses.length)];

        if (!question) {
            return;
        }

        // send the message
        await ctx.respond({ with: `Question: ${question} | Reply: ${response}` });
    }
}
