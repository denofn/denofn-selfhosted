export type RegistryJSON = {
  whitelist: string[];
  warmupOnStart?: boolean;
};

export type RegistryJSONInternal = RegistryJSON & {
  name: string;
  port: number;
};

export type RegistryKV = Record<string, number>;
