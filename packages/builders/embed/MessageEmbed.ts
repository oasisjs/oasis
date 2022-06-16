import type * as Discord from '../../deps.ts';

/**
 * Embed Limits
 */
export enum EmbedLimits {
    Title = 256,
    Description = 4096,
    FieldName = 256,
    FieldValue = 1024,
    FooterText = 2048,
    AuthorName = 256,
    Fields = 25,
    Total = 6000,
}

/**
 * MessageEmbed constructor inspired by discord.js
 * @example
 * const embed = new MessageEmbed()
 *  .setTitle("Hello, world!");
 */
export class MessageEmbed {
    total = 0;
    embed: Discord.Embed & { fields: Discord.DiscordEmbedField[] };
    safe: boolean;

    constructor(safe = true, embed: Discord.Embed = {}) {
        this.embed = Object.assign(embed, { fields: [] });
        this.safe = safe;
    }

    static from(json: Discord.Embed = {}, safe = true) {
        return new MessageEmbed(safe, json);
    }

    equal(embed: MessageEmbed | Discord.Embed) {
        if ('embed' in embed) {
            return Object.is(this.embed, embed.embed);
        }
        return Object.is(this.embed, embed);
    }

    /** sets the color of the current embed */
    color(color: number | [number, number, number] | `#${string}` | 'random') {
        if (Array.isArray(color)) {
            color = (color[0] << 16) + (color[1] << 8) + color[2];
        }
        if (typeof color === 'string') {
            if (color === 'random') {
                this.embed.color = Math.floor(Math.random() * (0xffffff + 1));
                return this;
            } else {
                this.embed.color = parseInt(color.replace('#', ''), 16);
                return this;
            }
        }

        if (this.safe && isNaN(color)) {
            throw new TypeError('Cannot convert NaN to a valid color');
        }

        this.embed.color = color;
        return this;
    }

    /** adds a field to the current embed */
    field(name: string, value: string, inline = false) {
        if (!this.embed.fields) {
            this.embed.fields = [];
        }

        if (this.safe && name.length > EmbedLimits.FieldName) {
            throw new TypeError('Embed field name limit exceeded');
        }

        if (this.safe && value.length > EmbedLimits.FieldValue) {
            throw new TypeError('Embed field value limit exceeded');
        }

        if (this.safe && this.embed.fields.length > EmbedLimits.Fields) {
            throw new TypeError('Embed fields limit exceeded');
        }

        this.embed.fields.push({ name, value, inline });
        this.total += name.length + value.length;

        return this;
    }

    /** sets the fields of the current embed */
    fields(fields: { name: string; value: string; inline?: boolean }[]) {
        if (this.safe && this.embed.fields!.length > EmbedLimits.Fields) {
            throw new TypeError('Embed fields limit exceeded');
        }

        for (const { name, value, inline } of fields) {
            this.field(name, value, inline);
        }

        return this;
    }

    /** adds a blank field to the current embed */
    blank(inline = true) {
        return this.field('\u200B', '\u200B', inline);
    }

    /** sets the timestamp of the current embed */
    timestamp(timestamp: number | Date) {
        this.embed.timestamp = timestamp instanceof Date
            ? timestamp.getMilliseconds() / 1000
            : typeof timestamp === 'number'
            ? timestamp
            : timestamp;

        return this;
    }

    /** sets the image of the current embed */
    image(url: string, proxyUrl?: string, height?: number, width?: number) {
        this.embed.image = { url, proxyUrl, height, width };
        return this;
    }

    /** sets the video of the current embed */
    video(url?: string, proxyUrl?: string, height?: number, width?: number) {
        this.embed.video = { url, proxyUrl, height, width };
        return this;
    }

    /** sets the thumbnail of the current embed */
    thumbnail(url: string, proxyUrl?: string, height?: number, width?: number) {
        this.embed.thumbnail = { url, proxyUrl, height, width };
        return this;
    }

    /** sets the title of the current embed */
    title(title: string) {
        if (this.safe && title.length > EmbedLimits.Title) {
            throw new TypeError('Embed title limit exceeded');
        }

        this.embed.title = title;
        this.total += title.length;

        return this;
    }

    /** sets the footer of the current embed */
    footer(text: string, iconUrl?: string, proxyIconUrl?: string) {
        if (this.safe && text.length > EmbedLimits.FooterText) {
            throw new TypeError('Embed footer text limit exceeded');
        }

        this.embed.footer = { text, iconUrl, proxyIconUrl };
        this.total += text.length;

        return this;
    }

    /** sets the author of the current embed */
    author(name: string, iconUrl?: string, url?: string, proxyIconUrl?: string) {
        if (this.safe && name.length > EmbedLimits.AuthorName) {
            throw new TypeError('Embed author name limit exceeded');
        }

        this.embed.author = { name, iconUrl, url, proxyIconUrl };
        this.total += name.length;

        return this;
    }

    provider(name: string, url: string) {
        this.embed.provider = { name, url };
        return this;
    }

    /** sets the url of the current embed */
    url(url: string) {
        this.embed.url = url;
        return this;
    }

    /** sets the description of the current embed */
    description(description: string) {
        if (this.safe && description.length > EmbedLimits.Description) {
            throw new TypeError('Embed description limit exceeded');
        }

        this.embed.description = description;
        this.total += description.length;

        return this;
    }

    toJSON() {
        return this.embed;
    }
}
