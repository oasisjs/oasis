import { ApplicationCommandOptionTypes, ChannelTypes } from "../../deps.ts";
import type { ApplicationCommandOption, ApplicationCommandOptionChoice } from "../../deps.ts";

export function Argument(description: string, required = false): PropertyDecorator {
    return function (object, name) {
        const argument: Partial<ApplicationCommandOption> = {
            name: name.toString(),
            description,
            required,
        };

        // @ts-expect-error: TODO
        const dataType = Reflect.getMetadata("design:type", object, name);

        argument.type =
            dataType === Boolean
                ? ApplicationCommandOptionTypes.Boolean
                : dataType === Number
                ? ApplicationCommandOptionTypes.Number
                : dataType === String
                ? ApplicationCommandOptionTypes.String
                : undefined;

        if (!argument.type) {
            throw new Error("Error: type cannot be guessed");
        }

        Object.defineProperty(object, name, { get: () => argument });
    };
}

/** @private */
function genericOption(
    type: ApplicationCommandOptionTypes,
    description: string,
    required = false,
    options?: object
): PropertyDecorator {
    return function (object, name) {
        const argument: Partial<ApplicationCommandOption> = {
            name: name.toString(),
            description,
            required,
            type,
            ...options,
        };

        Object.defineProperty(object, name, { get: () => argument });
    };
}

Argument.String = function (
    description: string,
    required = false,
    autocomplete?: boolean,
    choices?: ApplicationCommandOptionChoice
) {
    return genericOption(ApplicationCommandOptionTypes.String, description, required, { autocomplete, choices });
};

Argument.Number = function (
    description: string,
    required = false,
    autocomplete?: boolean,
    minValue?: number,
    maxValue?: number
) {
    return genericOption(ApplicationCommandOptionTypes.Number, description, required, {
        autocomplete,
        minValue,
        maxValue,
    });
};

Argument.Integer = function (
    description: string,
    required = false,
    autocomplete?: boolean,
    minValue?: number,
    maxValue?: number
) {
    return genericOption(ApplicationCommandOptionTypes.Integer, description, required, {
        autocomplete,
        minValue,
        maxValue,
    });
};

Argument.Channel = function (description: string, required = false, channelTypes?: ChannelTypes[]) {
    return genericOption(ApplicationCommandOptionTypes.Number, description, required, { channelTypes });
};

Argument.Role = function (description: string, required = false) {
    return genericOption(ApplicationCommandOptionTypes.Role, description, required);
};

Argument.User = function (description: string, required = false) {
    return genericOption(ApplicationCommandOptionTypes.User, description, required);
};

Argument.Mentionable = function (description: string, required = false) {
    return genericOption(ApplicationCommandOptionTypes.Mentionable, description, required);
};

Argument.Boolean = function (description: string, required = false) {
    return genericOption(ApplicationCommandOptionTypes.Boolean, description, required);
};

Argument.Attachment = function (description: string, required = false) {
    return genericOption(ApplicationCommandOptionTypes.Attachment, description, required);
};

Argument.SubCommand = function (description: string, required = false, instance: { options: unknown[] }) {
    return genericOption(ApplicationCommandOptionTypes.SubCommand, description, required, {
        options: instance.options,
    });
};

Argument.SubCommandGroup = function (description: string, required = false) {
    return genericOption(ApplicationCommandOptionTypes.SubCommandGroup, description, required);
};

export default Argument;
