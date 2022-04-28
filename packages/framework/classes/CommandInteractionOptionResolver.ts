import type { Id } from '../../deps.ts';
import type { InteractionDataOption, InteractionDataResolved } from '../../deps.ts';
import { ApplicationCommandOptionTypes } from '../../deps.ts';

/**
 * Utility function to get the value of an oasis command option
 */
export function transformInteractionDataOption(o: InteractionDataOption): OasisCommandInteractionOption {
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
    private _options: OasisCommandInteractionOption[];
    private _subcommand?: string;
    private _group?: string;
    public hoistedOptions: OasisCommandInteractionOption[];
    public resolved?: InteractionDataResolved;

    constructor(options?: InteractionDataOption[], resolved?: InteractionDataResolved) {
        this._options = options?.map(transformInteractionDataOption) ?? [];
        this.hoistedOptions = options?.map(transformInteractionDataOption) ?? [];

        if (this.hoistedOptions[0]?.type === ApplicationCommandOptionTypes.SubCommand) {
            this._group = this.hoistedOptions[0].name;
            this.hoistedOptions = (this.hoistedOptions[0].options ?? []).map(transformInteractionDataOption);
        }

        if (this.hoistedOptions[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup) {
            this._subcommand = this.hoistedOptions[0].name;
            this.hoistedOptions = (this.hoistedOptions[0].options ?? []).map(transformInteractionDataOption);
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

    public get(name: string | number, required: true): OasisCommandInteractionOption;
    public get(name: string | number, required: boolean): OasisCommandInteractionOption | undefined;
    public get(name: string | number, required?: boolean) {
        const option = this._options.find((o) =>
            typeof name === 'number' ? o.name === name.toString() : o.name === name
        );

        if (!option) {
            if (required && name in this._options.map((o) => o.name)) {
                throw new TypeError('Option marked as required was undefined');
            }

            return;
        }

        return option;
    }

    /** searches for a string option */
    public getString(name: string | number, required: true): string;
    public getString(name: string | number, required?: boolean): string | undefined;
    public getString(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.String, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a number option */
    public getNumber(name: string | number, required: true): number;
    public getNumber(name: string | number, required?: boolean): number | undefined;
    public getNumber(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Number, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searhces for an integer option */
    public getInteger(name: string | number, required: true): number;
    public getInteger(name: string | number, required?: boolean): number | undefined;
    public getInteger(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Integer, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a boolean option */
    public getBoolean(name: string | number, required: true): boolean;
    public getBoolean(name: string | number, required?: boolean): boolean | undefined;
    public getBoolean(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Boolean, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a user option */
    public getUser(name: string | number, required: true): bigint;
    public getUser(name: string | number, required?: boolean): bigint | undefined;
    public getUser(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.User, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a channel option */
    public getChannel(name: string | number, required: true): bigint;
    public getChannel(name: string | number, required?: boolean): bigint | undefined;
    public getChannel(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Channel, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a mentionable-based option */
    public getMentionable(name: string | number, required: true): string;
    public getMentionable(name: string | number, required?: boolean): string | undefined;
    public getMentionable(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Mentionable, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for a mentionable-based option */
    public getRole(name: string | number, required: true): bigint;
    public getRole(name: string | number, required?: boolean): bigint | undefined;
    public getRole(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Role, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for an attachment option */
    public getAttachment(name: string | number, required: true): string;
    public getAttachment(name: string | number, required?: boolean): string | undefined;
    public getAttachment(name: string | number, required = false) {
        const option = this.getTypedOption(name, ApplicationCommandOptionTypes.Attachment, ['Otherwise'], required);

        return option?.Otherwise ?? undefined;
    }

    /** searches for the focused option */
    public getFocused(full = false) {
        const focusedOption = this.hoistedOptions.find((option) => option.focused);

        if (!focusedOption) {
            throw new TypeError('No option found');
        }

        return full ? focusedOption : focusedOption.Otherwise;
    }

    public getSubcommand(required = true) {
        if (required && !this._subcommand) {
            throw new TypeError('Option marked as required was undefined');
        }

        return [this._subcommand, this.hoistedOptions];
    }

    public getSubcommandGroup(required = false) {
        if (required && !this._group) {
            throw new TypeError('Option marked as required was undefined');
        }

        return [this._group, this.hoistedOptions];
    }
}
