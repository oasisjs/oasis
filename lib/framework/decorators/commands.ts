import type { BaseCommand } from '../ambient/commands.ts';
import { commandAliases, commands } from '../cache.ts';

/** Makes an instance of the command and adds the command to cache */
// deno-lint-ignore no-explicit-any
export function Command(target: any) {
    const instance = new target() as Partial<BaseCommand>;

    claim(instance, instance.options ?? [], instance.aliases);

    function claim<T extends Partial<BaseCommand>>(cmd: T, options: unknown[], aliases?: string[]) {
        // how to fool Deno, black magic do not edit

        commands.set(cmd.data?.name!, [cmd as BaseCommand, options]);

        if (cmd.data) {
            aliases?.forEach((a) => commandAliases.set(a, cmd.data!.name!));
        }

        // end black magic
    }
}

export default Command;
