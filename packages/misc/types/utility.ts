import type { Bot } from "../../deps.ts";

export type Helper<T extends keyof Bot["helpers"]> = Bot["helpers"][T];
