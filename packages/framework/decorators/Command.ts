import type { BaseCommand } from '../classes/Command.ts';
import { commandAliases, commands } from '../cache.ts';

/** Makes an instance of the command and adds the command to cache */
export function Command<T extends { new (...args: unknown[]): Partial<BaseCommand> }>(target: T): void {
    const instance: Partial<BaseCommand> = new target();

    claim(instance, instance.options, instance.aliases);

    function claim<T extends Partial<BaseCommand>>(cmd: T, options?: unknown[], aliases?: string[]) {
        options ??= [];

        commands.set(cmd.data?.name!, [cmd as BaseCommand, options]);

        if (cmd.data) {
            aliases?.forEach((a) => commandAliases.set(a, cmd.data!.name!));
        }
    }
}

export default Command;
