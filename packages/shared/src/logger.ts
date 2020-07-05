import { Colors } from "../../../deps.ts";
import { LogLevel, LogSystem } from "./types.ts";

let logLevel: LogLevel = "info";

export const levels: LogLevel[] = ["info", "file", "verbose"];

export const setLogLevel = (l: LogLevel) => {
  logLevel = l;
};

const log = (tag: string, message: string, level: LogLevel) => {
  switch (logLevel) {
    case "file":
      if (level === "info") return;
    case "info":
      if (level === "verbose") return;
    case "verbose":
      console.log(tag.padEnd(20), message.padStart(60));
  }
};

export const script = (scriptName: string, message: string, level: LogLevel) =>
  log(Colors.yellow(`[${scriptName}]`), message, level);

export const system = (tag: LogSystem, message: string, level: LogLevel) =>
  log(Colors.blue(`[${tag}]`), message, level);

export const success = (tag: string, message: string, level: LogLevel) =>
  log(Colors.green(`[${tag}]`), message, level);

export const fail = (tag: string, message: string, level: LogLevel) =>
  log(Colors.red(`[${tag}]`), message, level);
