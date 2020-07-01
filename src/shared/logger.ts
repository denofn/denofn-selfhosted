import { Colors } from "../../deps.ts";

export const script = (scriptName: string, message: string) =>
  console.log(
    Colors.yellow(`[${scriptName}]`.padEnd(20)),
    message.padStart(60),
  );

export const system = (
  systemNameSpace: "Execution" | "Registry",
  lockInfo: string,
) =>
  console.log(
    Colors.blue(`[${systemNameSpace}]`.padEnd(20)),
    lockInfo.padStart(60),
  );

export const terminationSuccess = (
  scriptName: string,
  terminationSuccessMessage: string,
) =>
  console.log(
    Colors.green(`[${scriptName}]`.padEnd(20)),
    terminationSuccessMessage.padStart(60),
  );

export const noTermination = (
  scriptName: string,
  noTerminationMessage: string,
) =>
  console.log(
    Colors.red(`[${scriptName}]`.padEnd(20)),
    noTerminationMessage.padStart(60),
  );
