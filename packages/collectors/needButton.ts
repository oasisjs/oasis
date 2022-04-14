// all credits to the Discordeno authors

import type {
    ButtonCollector,
    ButtonCollectorOptions,
    ButtonCollectorReturn,
    CollectButtonOptions,
} from "./types/collector.ts";
import type { Interaction, Message } from "../deps.ts";
import { Milliseconds } from "./constants.ts";
import { Collection } from "../deps.ts";

export const collectors = {
    buttons: new Collection<bigint, ButtonCollector>(),
};

export const { buttons } = collectors;

export function collectButtons(options: CollectButtonOptions): Promise<ButtonCollectorReturn[]> {
    return new Promise((resolve, reject) => {
        collectors.buttons
            .get(options.key)
            ?.reject("A new collector began before the user responded to the previous one.");
        collectors.buttons.set(options.key, {
            ...options,
            buttons: [] as ButtonCollectorReturn[],
            resolve,
            reject,
        });
    });
}

export async function needButton(
    userId: bigint,
    messageId: bigint,
    options: ButtonCollectorOptions & { amount?: 1 }
): Promise<ButtonCollectorReturn>;
export async function needButton(
    userId: bigint,
    messageId: bigint,
    options: ButtonCollectorOptions & { amount?: number }
): Promise<ButtonCollectorReturn[]>;
export async function needButton(userId: bigint, messageId: bigint): Promise<ButtonCollectorReturn>;
export async function needButton(userId: bigint, messageId: bigint, options?: ButtonCollectorOptions) {
    const buttons = await collectButtons({
        key: userId,
        messageId,
        createdAt: Date.now(),
        filter: options?.filter ?? ((_, user) => (user ? userId === user.id : true)),
        amount: options?.amount ?? 1,
        duration: options?.duration ?? Milliseconds.Minute * 5,
    });

    return (options?.amount || 1) > 1 ? buttons : buttons[0];
}

export function processButtonCollectors(data: Interaction) {
    // All buttons will require a message
    if (!data.message) return;

    // If this message is not pending a button response, we can ignore
    const collector = collectors.buttons.get(data.user ? data.user.id : data.message.id);
    if (!collector) return;

    // TODO: improve this type
    // This message is a response to a collector. Now running the filter function.
    if (!collector.filter(data.message as Message, data.user)) return;

    // If the necessary amount has been collected
    if (collector.amount === 1 || collector.amount === collector.buttons.length + 1) {
        // Remove the collector
        collectors.buttons.delete(data.message.id);
        // Resolve the collector
        return collector.resolve([
            ...collector.buttons,
            {
                customId: data.data?.customId ?? "No customId provided for this button.",
                interaction: data,
                user: data.user,
            },
        ]);
    }

    // More buttons still need to be collected
    collector.buttons.push({
        customId: data.data?.customId ?? "No customId provided for this button.",
        interaction: data,
        user: data.user,
    });
}
