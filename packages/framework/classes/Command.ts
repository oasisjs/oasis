import type { ApplicationCommandOption, CreateApplicationCommand } from '../../deps.ts';
import type { Context } from './Context.ts';

/**
 * The data class for representing commands
 */
export declare class BaseCommand {
    readonly aliases: string[];
    readonly data: CreateApplicationCommand;
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}

/**
 * The data class for representing commands
 */
export declare class BaseSubCommand {
    readonly parent: string;
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}
