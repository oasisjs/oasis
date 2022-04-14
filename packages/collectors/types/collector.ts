import type { Interaction, Message, User } from "../../deps.ts";

// BASE

export interface BaseCollectorOptions {
    amount?: number;
    duration?: number;
}

export interface BaseCollectorCreateOptions extends BaseCollectorOptions {
    key: bigint;
    createdAt: number;
}

// BUTTONS

export interface CollectButtonOptions extends BaseCollectorCreateOptions {
    messageId: bigint;
    filter: (message: Message, user?: User) => boolean;
}

export interface ButtonCollector extends CollectButtonOptions {
    resolve: (value: ButtonCollectorReturn[] | PromiseLike<ButtonCollectorReturn[]>) => void;
    // deno-lint-ignore no-explicit-any
    reject: (reason?: any) => void;
    buttons: ButtonCollectorReturn[];
}

export interface ButtonCollectorOptions extends BaseCollectorOptions {
    filter?: (message: Message, user?: User) => boolean;
}

export interface ButtonCollectorReturn {
    customId: string;
    interaction: Omit<Interaction, "user">;
    user?: User;
}

// MESSAGES

export interface CollectMessagesOptions extends BaseCollectorCreateOptions {
    channelId: bigint;
    filter: (message: Message) => boolean;
}

export interface MessageCollector extends CollectMessagesOptions {
    resolve: (value: Message[] | PromiseLike<Message[]>) => void;
    // deno-lint-ignore no-explicit-any
    reject: (reason?: any) => void;
    messages: Message[];
}

export interface MessageCollectorOptions extends BaseCollectorOptions {
    filter?: (message: Message) => boolean;
    amount?: number;
    duration?: number;
}
