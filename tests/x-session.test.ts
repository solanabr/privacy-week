import { describe, expect, it } from "vitest";

import { readXAccountSession, signCookiePayload } from "@/lib/x-session";

describe("signed X account session", () => {
  const secret = "test-only-x-client-secret";
  const now = Date.UTC(2026, 9, 1, 12, 0, 0);

  it("accepts a valid, unexpired identity cookie", () => {
    const cookie = signCookiePayload(
      { id: "123456789", username: "privacy_builder", exp: now / 1000 + 60 },
      secret,
    );

    expect(readXAccountSession(cookie, secret, now)).toMatchObject({
      id: "123456789",
      username: "privacy_builder",
    });
  });

  it("rejects changed signatures and expired cookies", () => {
    const cookie = signCookiePayload(
      { id: "123456789", username: "privacy_builder", exp: now / 1000 + 60 },
      secret,
    );
    const changed = `${cookie.slice(0, -1)}${cookie.endsWith("a") ? "b" : "a"}`;
    const expired = signCookiePayload(
      { id: "123456789", username: "privacy_builder", exp: now / 1000 },
      secret,
    );

    expect(readXAccountSession(changed, secret, now)).toBeNull();
    expect(readXAccountSession(expired, secret, now)).toBeNull();
  });

  it("rejects malformed provider identities", () => {
    const cookie = signCookiePayload(
      { id: "not-a-numeric-id", username: "bad handle", exp: now / 1000 + 60 },
      secret,
    );

    expect(readXAccountSession(cookie, secret, now)).toBeNull();
  });
});
