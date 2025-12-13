
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("oracle contract tests", () => {
  it("allows owner to update price", () => {
    const asset = Cl.standardPrincipal(deployer);
    const price = Cl.uint(1000);

    const { result } = simnet.callPublicFn(
      "oracle",
      "update-price",
      [asset, price],
      deployer
    );

    expect(result).toBeOk(Cl.bool(true));
  });

  it("prevents non-owner from updating price", () => {
    const asset = Cl.standardPrincipal(deployer);
    const price = Cl.uint(2000);

    const { result } = simnet.callPublicFn(
      "oracle",
      "update-price",
      [asset, price],
      wallet1
    );

    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("can retrieve updated price", () => {
    const asset = Cl.standardPrincipal(deployer);
    const price = Cl.uint(1500);

    // Update price
    simnet.callPublicFn(
      "oracle",
      "update-price",
      [asset, price],
      deployer
    );

    // Get price
    const { result } = simnet.callReadOnlyFn(
      "oracle",
      "get-price",
      [asset],
      wallet1
    );

    expect(result).toBeOk(Cl.some(price));
  });

  it("returns none for unknown asset", () => {
    const asset = Cl.standardPrincipal(wallet1);

    const { result } = simnet.callReadOnlyFn(
      "oracle",
      "get-price",
      [asset],
      wallet1
    );

    expect(result).toBeOk(Cl.none());
  });
});
