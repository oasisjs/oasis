import type { ApplicationCommandOption, CreateApplicationCommand } from '../../deps.ts';
import type { Context } from './Context.ts';

/**
 * The data class for representing commands
 */
export interface BaseCommand {
    readonly aliases: string[];
    readonly data: CreateApplicationCommand;
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}

/**
 * The data class for representing commands
 */
export interface BaseSubCommand {
    readonly options: unknown[] | ApplicationCommandOption[];

    run(ctx: Context): Promise<unknown>;
}

/**
 * The data class for representing commands
 */
export interface BaseSubCommandGroup {
    readonly options: unknown[] | ApplicationCommandOption[];
}
