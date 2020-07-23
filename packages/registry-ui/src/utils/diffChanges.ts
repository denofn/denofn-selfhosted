import { State } from "../components/Function";

export function diffChanges(a: State, b: State): boolean {
  return (
    a.index === b.index &&
    a.registry.warmupOnStart === b.registry.warmupOnStart &&
    JSON.stringify(a.registry.whitelist) === JSON.stringify(b.registry.whitelist)
  );
}
