import type { ApplicationCommandOption, CreateApplicationCommand } from '../../deps.ts';
import type { Context } from './Context.ts';

/**
 * The data class for representing commands
 */
export declare class BaseCommand extends Object {
    readonly aliases: string[];
    readonly data: CreateApplicationCommand;
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}

/**
 * The data class for representing commands
 */
export declare class BaseSubCommand extends Object {
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}

/**
 * The data class for representing commands
 */
export declare class BaseSubCommandGroup extends Object {
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}
