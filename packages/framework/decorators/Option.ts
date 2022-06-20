import { ApplicationCommandOptionTypes, ChannelTypes } from '../../deps.ts';
import type { ApplicationCommandOption, ApplicationCommandOptionChoice } from '../../deps.ts';
import type { BaseCommand, BaseSubCommand, BaseSubCommandGroup } from '../classes/Command.ts';
import { subCommands, subCommandGroups } from '../cache.ts';

// this shouldn't get compiled
import { Reflect } from '../../../reflect-metadata.ts';


// DECORATORS METADATA
import { metadataHelpers, CommandLevel } from './metadata.ts';

import '../../../reflect-metadata.ts';

/**
 * Represents an option for a command
 */
export function Argument(description: string, required = false): PropertyDecorator {
    return function (object, name) {
        const argument: Partial<ApplicationCommandOption> = {
            name: name.toString(),
            description,
            required,
        };

        const dataType = Reflect.getMetadata('design:type', object, name);

        argument.type = dataType === Boolean
            ? ApplicationCommandOptionTypes.Boolean
            : dataType === Number
            ? ApplicationCommandOptionTypes.Number
            : dataType === String
            ? ApplicationCommandOptionTypes.String
            : undefined;

        if (!argument.type) {
            throw new Error('Error: type cannot be guessed');
        }

        Object.defineProperty(object, name, { get: () => argument });
    };
}

/** @private */
function genericOption(
    type: ApplicationCommandOptionTypes,
    description: string,
    required = false,
    options?: Record<string, unknown>,
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
    choices?: ApplicationCommandOptionChoice,
) {
    return genericOption(ApplicationCommandOptionTypes.String, description, required, { autocomplete, choices });
};

Argument.Number = function (
    description: string,
    required = false,
    autocomplete?: boolean,
    minValue?: number,
    maxValue?: number,
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
    maxValue?: number,
) {
    return genericOption(ApplicationCommandOptionTypes.Integer, description, required, {
        autocomplete,
        minValue,
        maxValue,
    });
};

Argument.Channel = function (description: string, required = false, channelTypes?: ChannelTypes[]) {
    return genericOption(ApplicationCommandOptionTypes.Channel, description, required, { channelTypes });
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

Argument.SubCommand = function (description: string, instance: BaseSubCommand): PropertyDecorator {
    return function (object, name) {
        const metadata = metadataHelpers.getOwnMetadata(instance);

        if (metadata.level !== CommandLevel.SubCommand) {
            return;
        }

        /** instrospection */
        subCommands.set(`${metadata.parents[0]}/${name.toString()}`, [instance, instance.options]);

        const argument: Partial<ApplicationCommandOption> = {
            name: name.toString(),
            description,
            type: ApplicationCommandOptionTypes.SubCommand,
            options: (instance.options ?? []) as ApplicationCommandOption[],
        };

        Object.defineProperty(object, name, { get: () => argument });
    };
};

Argument.SubCommandGroup = function (description: string, instance: BaseSubCommandGroup): PropertyDecorator {
    return function (object, name) {
        const metadata = metadataHelpers.getOwnMetadata(instance);

        if (metadata.level !== CommandLevel.SubCommandGroup) {
            return;
        }

        /** instrospection */
        subCommandGroups.set(`${metadata.parents[0]}/${metadata.parents[1]}/${name.toString()}`, [instance, instance.options]);

        const argument: Partial<ApplicationCommandOption> = {
            name: name.toString(),
            description,
            type: ApplicationCommandOptionTypes.SubCommand,
            options: (instance.options ?? []) as ApplicationCommandOption[],
        };

        Object.defineProperty(object, name, { get: () => argument });
    };
};

export const Option = Argument;

export default Argument;
