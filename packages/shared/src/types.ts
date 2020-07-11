export type RegistryJSON = {
  whitelist: string[];
  warmupOnStart?: boolean;
};

export type PartialInternalRegistry = {
  name: string;
  port: number;
  hashes: string[];
};

export type RegistryJSONInternal = RegistryJSON & PartialInternalRegistry;
export type ScriptRegistryIntake = [string, string[]][];

export type RegistryKV = Record<string, number>;

export type LogLevel = "info" | "verbose" | "file";
export type LogSystem = "Execution" | "Registry";
