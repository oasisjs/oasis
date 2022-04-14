import * as Colors from "https://deno.land/std@0.119.0/fmt/colors.ts";

export enum MsgTypes {
    Info = "INFO",
    Warn = "WARN",
    Error = "ERROR",
    Debug = "DEBUG",
    Sucess = "SUCESS",
}

/**
 * @private
 */
interface Details {
    args: unknown[];
    datetime: Date;
    level: string;
    msg: string;
    fn: (arg: string) => string;
}

/**
 * @private
 */
function formatInput({ args, datetime, level, msg, fn }: Details) {
    const coloredLevel = fn(level);
    const datestring = datetime.toLocaleDateString();

    if (args.length <= 0) {
        return `[${coloredLevel}] : ${datestring} : ${msg}`;
    }

    const target = args.reduce((acc: string, arg) => acc.replace("{}", arg as string), msg);
    const hasChanged = msg.length === target.length;

    if (!hasChanged) {
        return `[${coloredLevel}] : ${datestring} : ${target}`;
    }

    // @ts-ignore f*ck you deno
    const formatter = new Intl.ListFormat("en", { style: "narrow", type: "unit" });

    // @ts-ignore: TODO
    return `[${coloredLevel}] : ${datestring} : ${target + formatter.format(args)}`;
}

/**
 * @private
 */
function infoFn(msg: string, ...args: unknown[]) {
    const result = formatInput({
        msg: msg,
        args,
        datetime: new Date(),
        level: MsgTypes.Info,
        fn: Colors.cyan,
    });
    console.info(result);
    // return result;
}

/**
 * @private
 */
function debugFn(msg: string, ...args: unknown[]) {
    const result = formatInput({
        msg: msg,
        args,
        datetime: new Date(),
        level: MsgTypes.Debug,
        fn: Colors.gray,
    });
    console.debug(result);
    // return result;
}

/**
 * @private
 */
function errorFn(msg: string | Error, ...args: unknown[]) {
    if (typeof msg === "string") {
        msg = new Error(msg);
    }

    const result = formatInput({
        msg: msg.message,
        args,
        datetime: new Date(),
        level: MsgTypes.Error,
        fn: Colors.bgRed,
    });

    console.error(result);
    // return result;
}

/**
 * @private
 */
function warnFn(msg: string | Error, ...args: unknown[]) {
    if (typeof msg === "string") {
        msg = new Error(msg);
    }

    const result = formatInput({
        msg: msg.message,
        args,
        datetime: new Date(),
        level: MsgTypes.Warn,
        fn: Colors.yellow,
    });

    console.warn(result);
    // return result;
}

/**
 * @private
 */
function successFn(msg: string, code?: number, ...args: unknown[]) {
    const result = formatInput({
        msg: `[${code}] : ${msg}`,
        args,
        datetime: new Date(),
        level: MsgTypes.Sucess,
        fn: Colors.green,
    });

    console.log(result);
    // return result;
}

/**
 * Logs a message to the console with the proper formatting
 * example: log("hello {}", "world")
 */
export function info(msg: string, ...args: unknown[]) {
    return infoFn(msg, ...args);
}

export function debug(msg: string, ...args: unknown[]) {
    return debugFn(msg, ...args);
}

export function error(msg: string | Error, ...args: unknown[]) {
    return errorFn(msg, ...args);
}

export function warn(msg: string | Error, ...args: unknown[]) {
    return warnFn(msg, ...args);
}

export function success(msg: string, code?: number, ...args: unknown[]) {
    return successFn(msg, code, ...args);
}

export function content(level: MsgTypes, msg: string, fn: (arg: string) => string, ...args: unknown[]) {
    console.log(formatInput({ level, msg, fn, args, datetime: new Date() }));
}

// DEFAULT LOG FUNCTION
export default info;
