// deno-lint-ignore-file no-namespace

export namespace Util {
    export const DiscordEpoch = 14200704e5;

    export function snowflakeToTimestamp(id: bigint) {
        return Number(id >> 22n) + Util.DiscordEpoch;
    }
}
