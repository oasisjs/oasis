import type { Events } from '../../deps.ts';
import type { BaseCommand, BaseSubCommand, BaseSubCommandGroup } from './ambient/commands.ts';

/**
 * @example
 * "emotes" => Command
 */
export const commands = new Map<string, [BaseCommand, unknown[]]>();

/**
 * @example
 * "emotes/add" => SubCommand
 * "emotes/remove" => SubCommand
 */
export const subCommands = new Map<string, [BaseSubCommand, unknown[]]>();

/**
 * @example
 * "emotes/add/whatever" => SubCommandGroup
 * "emotes/remove/etc" => SubCommandGroup
 */
export const subCommandGroups = new Map<string, [BaseSubCommand, unknown[]]>();

/**
 * @example
 * "pfp" => "avatar"
 * "avy" => "avatar"
 * "pic" => "avatar"
 */
export const commandAliases = new Map<string, string>();

type Values<T> = T[keyof T];

type Variants<Dictionary extends Omit<Events, 'debug'>> = Values<
    {
        [Prop in keyof Dictionary]: {
            name: Prop;
            run: Dictionary[Prop];
        };
    }
>;

export type Event = Variants<Omit<Events, 'debug'>>;

/**
 * helper function to create events
 */
export function createEvent(o: Event) {
    events.set(o.name as string, o);
    return o;
}

export const events = new Map<string, Event>();
