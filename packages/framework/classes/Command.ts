import type { CreateApplicationCommand } from "../../deps.ts";
import type { Context } from "./Context.ts";
import { commands, commandAliases } from "../cache.ts";

/**
 * Adds a command to the cache
 */
export function claim<T extends Partial<BaseCommand>>(cmd: T, options?: unknown[], aliases?: string[]) {
    options ??= [];

    commands.set(cmd.data?.name!, [cmd as BaseCommand, options]);

    if (cmd.data) aliases?.forEach(a => commandAliases.set(a, cmd.data!.name!));
}

/**
 * The Oasis data class for representing commands
 */
export declare class BaseCommand {
    readonly aliases: string[];
    readonly data: CreateApplicationCommand;
    readonly options: unknown[];

    run(ctx: Context): Promise<void>;
}
