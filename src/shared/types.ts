export type PermissionKeys =
  | "allow-all"
  | "allow-env"
  | "allow-hrtime"
  | "allow-plugin"
  | "allow-run";
export type NetPermissionKey = "allow-net";
export type NetPermission = string[];
export type ReadPermissionKey = "allow-read";
export type ReadPermission = string[];
export type WritePermissionKey = "allow-write";
export type WritePermission = string[];
export type BasicPermissions = Record<PermissionKeys, boolean>;
export type Permissions = BasicPermissions & { "allow-net": NetPermission } & {
  "allow-read": ReadPermission;
} & {
  "allow-write": WritePermission;
};

export type RegistryJSON = {
  permissions: (keyof Permissions)[];
};

export type RegistryJSONInternal = RegistryJSON & {
  name: string;
  port: number;
};

export type RegistryKV = Record<string, number>;
