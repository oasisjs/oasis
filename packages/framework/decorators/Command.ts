import type { BaseCommand } from '../classes/Command.ts';
import { claim } from '../classes/Command.ts';

/** Makes an instance of the command and adds the command to cache */
export function Command<T extends { new (...args: unknown[]): Partial<BaseCommand> }>(target: T): void {
    const instance: Partial<BaseCommand> = new target();

    claim(instance, instance.options, instance.aliases);
}

export default Command;
