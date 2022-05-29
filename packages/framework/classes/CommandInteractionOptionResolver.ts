import type { Id } from '../../deps.ts';
import type { InteractionDataOption, InteractionDataResolved } from '../../deps.ts';
import { ApplicationCommandOptionTypes } from '../../deps.ts';

/**
 * Utility function to get the value of an oasis command option
 */
export function transformOasisInteractionDataOption(o: InteractionDataOption): OasisCommandInteractionOption {
    const output: OasisCommandInteractionOption = { ...o, Otherwise: o.value as string | boolean | number | undefined };

    switch (o.type) {
        case ApplicationCommandOptionTypes.String:
            output.String = o.value as string;
            break;
        case ApplicationCommandOptionTypes.Number:
            output.Number = o.value as number;
            break;
        case ApplicationCommandOptionTypes.Integer:
            output.Integer = o.value as number;
            break;
        case ApplicationCommandOptionTypes.Boolean:
            output.Boolean = o.value as boolean;
            break;
        case ApplicationCommandOptionTypes.Role:
            output.Role = BigInt(o.value as string);
            break;
        case ApplicationCommandOptionTypes.User:
            output.User = BigInt(o.value as string);
            break;
        case ApplicationCommandOptionTypes.Channel:
            output.Channel = BigInt(o.value as string);
            break;

        case ApplicationCommandOptionTypes.Mentionable:
        case ApplicationCommandOptionTypes.SubCommand:
        case ApplicationCommandOptionTypes.SubCommandGroup:
        default:
            output.Otherwise = o.value as string | boolean | number | undefined;
    }

    return output;
}

export interface OasisCommandInteractionOption extends Id<Omit<InteractionDataOption, 'value'>> {
    Attachment?: string;
    Boolean?: boolean;
    User?: bigint;
    Role?: bigint;
    Number?: number;
    Integer?: number;
    Channel?: bigint;
    String?: string;
    Mentionable?: string;
    Otherwise: string | number | boolean | bigint | undefined;
}

/**
 * Utility class to get the resolved options for a command
 * It is really typesafe
 * @example const option = ctx.options.getStringOption("name");
 */
export class CommandInteractionOptionResolver {
    #options: OasisCommandInteractionOption[];
    #subcommand?: string;
    #group?: string;

    hoistedOptions: OasisCommandInteractionOption[];
    resolved?: InteractionDataResolved;

    constructor(options?: InteractionDataOption[], resolved?: InteractionDataResolved) {
        this.#options = options?.map(transformOasisInteractionDataOption) ?? [];
        this.hoistedOptions = options?.map(transformOasisInteractionDataOption) ?? [];

        if (this.hoistedOptions[0]?.type === ApplicationCommandOptionTypes.SubCommand) {
            this.#group = this.hoistedOptions[0].name;
            this.hoistedOptions = (this.hoistedOptions[0].options ?? []).map(transformOasisInteractionDataOption);
        }

        if (this.hoistedOptions[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup) {
            this.#subcommand = this.hoistedOptions[0].name;
            this.hoistedOptions = (this.hoistedOptions[0].options ?? []).map(transformOasisInteractionDataOption);
        }

        this.resolved = resolved;
    }

    private getTypedOption(
        name: string | number,
        type: ApplicationCommandOptionTypes,
        properties: Array<keyof OasisCommandInteractionOption>,
        required: boolean,
    ) {
        const option = this.get(name, required);

        if (!option) {
            return;
        }

        if (option.type !== type) {
            // pass
        }

        if (required === true && properties.every((prop) => !option[prop])) {
            throw new TypeError(`Properties ${properties.join(', ')} are missing in option ${name}`);
        }

        return option;
    }

    get(name: string | number, required: true): OasisCommandInteractionOption;
    get(name: string | number, required: boolean): OasisCommandInteractionOption | undefined;
    get(name: string | number, required?: boolean) {
        const option = this.#options.find((o) =>
            typeof name === 'number' ? o.name === name.toString() : o.name === name
        );

        if (!option) {
            if (required && name in this.#options.map((o) => o.name)) {
                throw new TypeError('Option marked as required was undefined');
            }

            return;
        }

        return option;
    }

    /** searches for a string option */
    getString(name: string | number, required: true): string;
    getString(name: string | number, required?: boolean): string | undefined;
    getString(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.String, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a number option */
    getNumber(name: string | number, required: true): number;
    getNumber(name: string | number, required?: boolean): number | undefined;
    getNumber(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Number, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searhces for an integer option */
    getInteger(name: string | number, required: true): number;
    getInteger(name: string | number, required?: boolean): number | undefined;
    getInteger(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Integer, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a boolean option */
    getBoolean(name: string | number, required: true): boolean;
    getBoolean(name: string | number, required?: boolean): boolean | undefined;
    getBoolean(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Boolean, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a user option */
    getUser(name: string | number, required: true): bigint;
    getUser(name: string | number, required?: boolean): bigint | undefined;
    getUser(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.User, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a channel option */
    getChannel(name: string | number, required: true): bigint;
    getChannel(name: string | number, required?: boolean): bigint | undefined;
    getChannel(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Channel, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a mentionable-based option */
    getMentionable(name: string | number, required: true): string;
    getMentionable(name: string | number, required?: boolean): string | undefined;
    getMentionable(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Mentionable, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a mentionable-based option */
    getRole(name: string | number, required: true): bigint;
    getRole(name: string | number, required?: boolean): bigint | undefined;
    getRole(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Role, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for an attachment option */
    getAttachment(name: string | number, required: true): string;
    getAttachment(name: string | number, required?: boolean): string | undefined;
    getAttachment(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Attachment, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for the focused option */
    getFocused(full = false) {
        const focusedOption = this.hoistedOptions.find((option) => option.focused);

        if (!focusedOption) {
            throw new TypeError('No option found');
        }

        return full ? focusedOption : focusedOption.Otherwise;
    }

    getSubcommand(required = true) {
        if (required && !this.#subcommand) {
            throw new TypeError('Option marked as required was undefined');
        }

        return [this.#subcommand, this.hoistedOptions];
    }

    getSubcommandGroup(required = false) {
        if (required && !this.#group) {
            throw new TypeError('Option marked as required was undefined');
        }

        return [this.#group, this.hoistedOptions];
    }
}
