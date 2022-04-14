import type * as Discord from "../../deps.ts";

export enum Limits {
    Title = 256,
    Description = 4096,
    FieldName = 256,
    FieldValue = 1024,
    FooterText = 2048,
    AuthorName = 256,
    Fields = 25,
    Total = 6000,
}

export class MessageEmbed {
    public total = 0;
    public file?: Discord.FileContent;
    public embed: Discord.Embed & { fields: Discord.DiscordEmbedField[] };

    public constructor(embed: Discord.Embed = {}) {
        this.embed = Object.assign(embed, { fields: [] });
    }

    public equal(embed: MessageEmbed | Discord.Embed) {
        if ("embed" in embed) {
            return Object.is(this.embed, embed.embed);
        }
        return Object.is(this.embed, embed);
    }

    public color(color: number | [number, number, number] | `#${string}` | "random") {
        if (Array.isArray(color)) {
            color = (color[0] << 16) + (color[1] << 8) + color[2];
        }
        if (typeof color === "string") {
            if (color === "random") {
                this.embed.color = Math.floor(Math.random() * (0xffffff + 1));
                return this;
            } else {
                this.embed.color = parseInt(color.replace("#", ""), 16);
                return this;
            }
        }
        if (color < 0 || color > 0xffffff) throw new RangeError("COLOR_RANGE");
        if (isNaN(color)) throw new TypeError("COLOR_CONVERT");

        this.embed.color = color;
        return this;
    }

    public field(name: string, value: string, inline = false) {
        if (!this.embed.fields) {
            this.embed.fields = [];
        }

        if (name.length > Limits.FieldName) {
            throw new TypeError("Embed field name limit exceeded");
        }

        if (value.length > Limits.FieldValue) {
            throw new TypeError("Embed field value limit exceeded");
        }

        if (this.embed.fields.length > Limits.Fields) {
            throw new TypeError("Embed fields limit exceeded");
        }

        this.embed.fields.push({ name, value, inline });
        this.total += name.length + value.length;

        return this;
    }

    public fields(fields: { name: string; value: string; inline?: boolean }[]) {
        if (this.embed.fields!.length > Limits.Fields) {
            throw new TypeError("Embed fields limit exceeded");
        }

        for (const { name, value, inline } of fields) {
            this.field(name, value, inline);
        }

        return this;
    }

    public blank(inline = true) {
        return this.field("\u200B", "\u200B", inline);
    }

    public attachment(attachment: Discord.FileContent) {
        this.file = {
            blob: attachment.blob,
            name: attachment.name,
        };

        return this.image(`attachment${attachment.name}`);
    }

    public timestamp(timestamp: number | Date) {
        this.embed.timestamp =
            timestamp instanceof Date
                ? timestamp.getMilliseconds() / 1000
                : typeof timestamp === "number"
                ? timestamp
                : timestamp;

        return this;
    }

    public image(url: string, proxyUrl?: string, height?: number, width?: number) {
        this.embed.image = { url, proxyUrl, height, width };
        return this;
    }

    public video(url?: string, proxyUrl?: string, height?: number, width?: number) {
        this.embed.video = { url, proxyUrl, height, width };
        return this;
    }

    public thumbnail(url: string, proxyUrl?: string, height?: number, width?: number) {
        this.embed.thumbnail = { url, proxyUrl, height, width };
        return this;
    }

    public title(title: string) {
        if (title.length > Limits.Title) {
            throw new TypeError("Embed title limit exceeded");
        }

        this.embed.title = title;
        this.total += title.length;

        return this;
    }

    public footer(text: string, iconUrl?: string, proxyIconUrl?: string) {
        if (text.length > Limits.FooterText) {
            throw new TypeError("Embed footer text limit exceeded");
        }

        this.embed.footer = { text, iconUrl, proxyIconUrl };
        this.total += text.length;

        return this;
    }

    public author(name: string, iconUrl?: string, url?: string, proxyIconUrl?: string) {
        if (name.length > Limits.AuthorName) {
            throw new TypeError("Embed author name limit exceeded");
        }

        this.embed.author = { name, iconUrl, url, proxyIconUrl };
        this.total += name.length;

        return this;
    }

    public provider(name: string, url: string) {
        this.embed.provider = { name, url };
        return this;
    }

    public url(url: string) {
        this.embed.url = url;
        return this;
    }

    public description(description: string) {
        if (description.length > Limits.Description) {
            throw new TypeError("Embed description limit exceeded");
        }

        this.embed.description = description;
        this.total += description.length;

        return this;
    }

    public toJSON() {
        return this.embed;
    }
}
