import type { EventHandlers } from '../deps.ts';

import type { BaseCommand, BaseSubCommand, BaseSubCommandGroup } from './classes/Command.ts';

import { Collection } from '../deps.ts';

/**
 * @example
 * "emotes" => Command
 */
export const commands = new Collection<string, [BaseCommand, unknown[]]>();

/**
 * @example
 * "emotes/add" => SubCommand
 * "emotes/remove" => SubCommand
 */
export const subCommands = new Collection<string, [BaseSubCommand, unknown[]]>();

/**
 * @example
 * "emotes/add/whatever" => SubCommandGroup
 * "emotes/remove/etc" => SubCommandGroup
 */
export const subCommandGroups = new Collection<string, [BaseSubCommand, unknown[]]>();

/**
 * @example
 * "pfp" => "avatar"
 * "avy" => "avatar"
 * "pic" => "avatar"
 */
export const commandAliases = new Collection<string, string>();

type Values<T> = T[keyof T];

type Variants<Dictionary extends Omit<EventHandlers, 'debug'>> = Values<
    {
        [Prop in keyof Dictionary]: {
            name: Prop;
            run: Dictionary[Prop];
        };
    }
>;

export type Event = Variants<Omit<EventHandlers, 'debug'>>;

/**
 * helper function to create events
 */
export function createEvent(o: Event) {
    events.set(o.name, o);
    return o;
}

export const events = new Collection<string, Event>();
