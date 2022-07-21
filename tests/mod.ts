import 'https://deno.land/std@0.146.0/dotenv/load.ts';
import { GatewayIntents, loadDirs as handle, modules, Session } from './deps.ts';

const intents = GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.MessageContent;
const session = modules.enableCommandContext('!')(new Session({ token: Deno.env.get('TOKEN')!, intents }));

await handle('./core', ['commands']);
await session.start();
