import type { Context } from '../../deps.ts';
import { Argument as Option, Command } from '../../deps.ts';
import { Ping } from './SubCommand.ping.ts';
import { Pong } from './SubCommand.pong.ts';

@Command
export class Repl {
    readonly data = {
        name: 'repl',
        description: 'ping the bot',
    };

    @Option.SubCommand('a', new Ping())
    declare ping: Ping;

    @Option.SubCommand('b', new Pong())
    declare pong: Ping;

    get options() {
        return [this.ping, this.pong];
    }

    async run(_ctx: Context) {
        // pass
    }
}
