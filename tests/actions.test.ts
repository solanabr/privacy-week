import { afterEach, describe, expect, it, vi } from "vitest";

import { createSubmissionAction, updateSubmissionAction } from "@/app/(site)/enviar/actions";
import { initialFormState } from "@/lib/form-state";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("submission actions enforce the server deadline", () => {
  it("rejects create and edit after the close time", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_NOW", "2026-10-04T00:00:00-03:00");

    const createResult = await createSubmissionAction(initialFormState, new FormData());
    const editResult = await updateSubmissionAction("token", initialFormState, new FormData());

    expect(createResult).toMatchObject({ status: "error", message: "As submissões estão encerradas." });
    expect(editResult).toMatchObject({ status: "error", message: "As submissões estão encerradas." });
  });
});
