import type { EventHandlers } from "../deps.ts";

import type { BaseCommand } from "./classes/Command.ts";

import { Collection } from "../deps.ts";

export const commands = new Collection<string, [BaseCommand, unknown[]]>();
export const commandAliases = new Collection<string, string>();

type Values<T> = T[keyof T];

type Variants<Dictionary extends Omit<EventHandlers, "debug">> = Values<{
    [Prop in keyof Dictionary]: {
        name: Prop;
        execute: Dictionary[Prop];
    };
}>;

export type Event = Variants<Omit<EventHandlers, "debug">>;

export function createEvent(o: Event) {
    events.set(o.name, o);
    return o;
}

export const events = new Collection<string, Event>();
