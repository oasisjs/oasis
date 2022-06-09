import type { ApplicationCommandOption, EventHandlers } from "./deps.ts";
import {
    ApplicationCommandTypes,
    BitwisePermissionFlags,
    GatewayIntents,
    enableCachePlugin,
    OasisClient,
    Contrib,
    loadDirs,
    upsertApplicationCommands,
    commands
} from "./deps.ts";

loadDirs("core", ["commands"]);

// deno-fmt-ignore
const BASE_PERMISSIONS =
      BitwisePermissionFlags.VIEW_CHANNEL
    | BitwisePermissionFlags.SEND_MESSAGES
    | BitwisePermissionFlags.EMBED_LINKS
    | BitwisePermissionFlags.ATTACH_FILES
    | BitwisePermissionFlags.READ_MESSAGE_HISTORY
    | BitwisePermissionFlags.CHANGE_NICKNAME;

const inviteUrl = (botId: bigint, perms: number) =>
    "https://discord.com/oauth2/" +
    `authorize?client_id=${botId}&scope=bot%20applications.commands&permissions=${perms}`;

const client = new OasisClient({
    async ready(bot, payload) {
        console.info("Ready! logged as %s with id %d", payload.user.username, bot.id);
        console.info(inviteUrl(bot.id, BASE_PERMISSIONS));

        if (Deno.args[1]) {
            try {
                // commands.forEach(([command]) => console.log(command));

                await upsertApplicationCommands(
                    bot,
                    commands.map(([command, options]) => {
                        return {
                            name: command.data.name,
                            description: command.data.description,
                            options: options as ApplicationCommandOption[],
                            type: ApplicationCommandTypes.ChatInput,
                            defaultPermission: true,
                        };
                    }),
                    BigInt(Deno.args[1])
                );
            }
            catch (e) {
                console.error(e);
            }
        }
    },
});

client.setToken(Deno.args[0]);

(["Guilds", "GuildMessages", "MessageContent"] as Array<keyof typeof GatewayIntents>)
    .map(intent => GatewayIntents[intent])
    .forEach(intent => client.addIntent(intent));

await client.start([
    enableCachePlugin,
    Contrib.enableBigBrainCommandContext("!!")
]);