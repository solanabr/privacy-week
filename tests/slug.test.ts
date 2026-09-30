import { describe, expect, it } from "vitest";

import { makeSlug, slugify } from "@/lib/slug";

describe("slugify", () => {
  it("removes accents and lowercases", () => {
    expect(slugify("Pagamentos Privados")).toBe("pagamentos-privados");
    expect(slugify("Café com Açúcar")).toBe("cafe-com-acucar");
  });

  it("collapses symbols into single dashes and trims", () => {
    expect(slugify("  Foo --- Bar!!  ")).toBe("foo-bar");
  });

  it("limits the length", () => {
    expect(slugify("a".repeat(100)).length).toBeLessThanOrEqual(60);
  });
});

describe("makeSlug", () => {
  it("appends the suffix", () => {
    expect(makeSlug("Meu Projeto", "abc123")).toBe("meu-projeto-abc123");
  });

  it("falls back when the name has no usable characters", () => {
    expect(makeSlug("!!!", "abc123")).toBe("projeto-abc123");
  });

  it("generates distinct random suffixes", () => {
    expect(makeSlug("Projeto")).not.toBe(makeSlug("Projeto"));
  });
});
