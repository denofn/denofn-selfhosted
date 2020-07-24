export type RegistryJSON = {
  whitelist: string[];
  warmupOnStart?: boolean;
};

export type ViewsState = {
  current: "view-all" | "manage" | "create";
  manage?: string;
};
