import { afterEach, describe, expect, it, vi } from "vitest";

import { createSubmissionAction, updateSubmissionAction } from "@/app/(site)/enviar/actions";
import { initialFormState } from "@/lib/form-state";
import { getConnectedXAccount } from "@/lib/x-oauth";

vi.mock("@/lib/x-oauth", () => ({
  getConnectedXAccount: vi.fn(),
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("submission actions enforce the server deadline", () => {
  it("rejects create and edit after the close time", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_NOW", "2026-10-05T04:00:01-03:00");

    const createResult = await createSubmissionAction(initialFormState, new FormData());
    const editResult = await updateSubmissionAction("token", initialFormState, new FormData());

    expect(createResult).toMatchObject({ status: "error", message: "As submissões estão encerradas." });
    expect(editResult).toMatchObject({ status: "error", message: "As submissões estão encerradas." });
  });

  it("rejects project creation unless a verified X account is connected", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_NOW", "2026-10-01T12:00:00-03:00");
    vi.mocked(getConnectedXAccount).mockResolvedValue(null);

    const result = await createSubmissionAction(initialFormState, new FormData());

    expect(result).toMatchObject({
      status: "error",
      message: "Conecte sua conta do X antes de enviar o projeto.",
    });
  });
});
