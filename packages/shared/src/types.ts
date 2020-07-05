export type RegistryJSON = {
  whitelist: string[];
  warmupOnStart?: boolean;
};

export type RegistryJSONInternal = RegistryJSON & {
  name: string;
  port: number;
};

export type RegistryKV = Record<string, number>;

export type LogLevel = "info" | "verbose" | "file";
export type LogSystem = "Execution" | "Registry";
