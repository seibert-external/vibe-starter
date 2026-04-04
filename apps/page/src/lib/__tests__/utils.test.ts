import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "visible")).toBe("base visible");
  });

  it("merges tailwind conflicts (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });
});
