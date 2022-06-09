import type { BotWithCache, Context } from "../../deps.ts";
import { Argument, Command } from "../../deps.ts";

/** @private */
enum SafetyLevels {
    Off = -2,
    Moderate, // -1
    Strict = 1,
}

@Command
export class Image {
    readonly data = {
        name: "image",
        description: "Sends an image to the channel.",
    };

    readonly aliases = ["img"];

    @Argument("the search query to find", true)
    declare query: string;

    get options(): unknown[] {
        return [this.query];
    }

    readonly #url = "https://duckduckgo.com/";

    #serializeParams(params: Record<string, string>) {
        return Object.keys(params)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]!))
            .join("&");
    }

    #getToken(keywords: string) {
        return fetch(`${this.#url}?${this.#serializeParams({ q: keywords })}`)
            .then(r => r.text())
            .then(r => r?.match(/vqd=([\d-]+)\&/)?.[1]); // is this legal? idk
    }

    async run(ctx: Context<BotWithCache>) {
        // phase one

        const search = ctx.options.getString(0) ?? ctx.options.getString("query", true);

        if (!search) {
            await ctx.respondPrivately({ with: "You must provide at least one search term" });
            return;
        }

        const token = await this.#getToken(search);

        if (!token) {
            // await ctx.respondPrivately({ with: 'No results found' });
            return;
        }

        const { channelId } = ctx;

        if (!channelId) {
            return;
        }

        const channel =
            ctx.bot.channels.get(channelId) ?? (await ctx.bot.helpers.getChannel(channelId));

        if (!channel) {
            return;
        }

        const safetyLevel = {
            true: SafetyLevels.Off,
            false: SafetyLevels.Strict,
            otherwise: SafetyLevels.Moderate,
        };

        const params = {
            vqd: token,
            l: "us-en",
            f: ",,,",
            q: search,
            o: "json",
            p: safetyLevel[channel.nsfw ? "true" : "false"].toString(),
        };

        interface ImageResponse {
            image: string;
            url: string;
            title: string;
            thumbnail: string;
            width: number;
            height: number;
            source: string;
        }

        const images = await fetch(this.#url + "i.js" + "?" + this.#serializeParams(params))
            .then(r => r.json())
            .then(r => r.results as ImageResponse[]);

        if (images.length === 0) {
            await ctx.respondPrivately({ with: "No results found" });
            return;
        }

        // phase two

        await ctx.respond({ with: images[0]?.image ?? "No image found" });
    }
}
