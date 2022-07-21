import {
    GatewayIntents,
    loadDirs as handle,
    modules,
    Session
} from '../deps.ts';

const intents = GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.MessageContent;
const session = modules.enableCommandContext('!')(new Session({ token: Deno.env.get('TOKEN')!, intents }));

await handle('', ['commands']);
await session.start();
