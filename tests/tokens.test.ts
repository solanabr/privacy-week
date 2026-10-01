import { describe, expect, it } from "vitest";

import {
  authenticateBasic,
  parseAdminUsers,
} from "@/lib/auth";
import {
  constantTimeEqual,
  generateEditToken,
  hashEditToken,
  hashIp,
} from "@/lib/tokens";

describe("edit tokens", () => {
  it("generates URL-safe tokens", () => {
    const token = generateEditToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(generateEditToken()).not.toBe(token);
  });

  it("hashes deterministically to a 64-char hex string", () => {
    const hash = hashEditToken("abc");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hashEditToken("abc")).toBe(hash);
    expect(hashEditToken("abd")).not.toBe(hash);
  });
});

describe("hashIp", () => {
  it("salts the hash", () => {
    expect(hashIp("1.2.3.4", "salt-a")).not.toBe(hashIp("1.2.3.4", "salt-b"));
    expect(hashIp("1.2.3.4", "salt")).toBe(hashIp("1.2.3.4", "salt"));
  });
});

describe("constantTimeEqual", () => {
  it("compares strings", () => {
    expect(constantTimeEqual("hello", "hello")).toBe(true);
    expect(constantTimeEqual("hello", "world")).toBe(false);
    expect(constantTimeEqual("hello", "hello!")).toBe(false);
  });
});

describe("admin auth", () => {
  const users = parseAdminUsers("ana:secret,bruno:pw2");

  it("parses name:password pairs", () => {
    expect(users).toEqual([
      { name: "ana", password: "secret" },
      { name: "bruno", password: "pw2" },
    ]);
  });

  it("handles passwords containing colons", () => {
    expect(parseAdminUsers("a:1:2")[0]).toEqual({ name: "a", password: "1:2" });
  });

  it("authenticates a valid basic header", () => {
    const header = `Basic ${Buffer.from("ana:secret").toString("base64")}`;
    expect(authenticateBasic(header, users)).toBe("ana");
  });

  it("rejects wrong credentials and malformed headers", () => {
    const wrong = `Basic ${Buffer.from("ana:nope").toString("base64")}`;
    expect(authenticateBasic(wrong, users)).toBeNull();
    expect(authenticateBasic(null, users)).toBeNull();
    expect(authenticateBasic("Bearer x", users)).toBeNull();
    expect(authenticateBasic("Basic not-base64!!", users)).toBeNull();
  });
});
