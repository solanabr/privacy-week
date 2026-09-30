import type { SubmissionFormValues } from "./validation";

export interface SubmissionFormState {
  status: "idle" | "error" | "saved";
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: SubmissionFormValues;
}

export const initialFormState: SubmissionFormState = { status: "idle" };

export const FLASH_COOKIE = "pw_edit_flash";
