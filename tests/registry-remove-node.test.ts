import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Node Registry: Remove Node", () => {
  // Helper to create a sample public key buffer (33 bytes)
  const samplePublicKey = Cl.buffer(new Uint8Array(33).fill(1));
  const sampleEndpoint = Cl.stringAscii("https://node1.example.com/api");

  it("allows owner to remove a registered node", () => {
    // First, register a node as wallet1
    const registerResult = simnet.callPublicFn(
      "node-registry",
      "register-node",
      [samplePublicKey, sampleEndpoint],
      wallet1
    );
    expect(registerResult.result).toBeOk(Cl.bool(true));

    // Verify node exists
    const nodeBefore = simnet.callReadOnlyFn(
      "node-registry",
      "get-node",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );
    expect(nodeBefore.result).not.toBeNone();

    // Owner (deployer) removes the node
    const removeResult = simnet.callPublicFn(
      "node-registry",
      "remove-node",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );
    expect(removeResult.result).toBeOk(Cl.bool(true));

    // Verify node no longer exists
    const nodeAfter = simnet.callReadOnlyFn(
      "node-registry",
      "get-node",
      [Cl.standardPrincipal(wallet1)],
      deployer
    );
    expect(nodeAfter.result).toBeNone();
  });
});
