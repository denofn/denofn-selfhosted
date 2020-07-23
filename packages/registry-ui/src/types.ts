export type RegistryJSON = {
  whitelist: string[];
  warmupOnStart?: boolean;
};

export type ViewsState = {
  current: "login" | "view-all" | "manage" | "create";
  manage?: string;
  // functionState?: {
  //   name: string;
  //   registry: RegistryJSON;
  //   index: string;
  // };
};
