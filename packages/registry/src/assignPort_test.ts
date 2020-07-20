import {
  addPortsRegistry,
  assertEquals,
  assertThrows,
  removePortsRegistry,
} from "../../testing/mod.ts";
import { assignPort, basePort, maxPort } from "./assignPort.ts";

Deno.test("should assign basePort when no other scripts are present", () => {
  const port = assignPort("test");

  assertEquals(port, basePort);
  removePortsRegistry();
});

Deno.test("should assign bumped port when other scripts are present", () => {
  addPortsRegistry(`{"test":${basePort}}`);

  const port = assignPort("test2");

  assertEquals(port, basePort + 1);
  removePortsRegistry();
});

Deno.test("should throw error when maxPort is reached", () => {
  addPortsRegistry(`{"test":${maxPort}}`);

  assertThrows(() => {
    assignPort("test2");
  });

  removePortsRegistry();
});
