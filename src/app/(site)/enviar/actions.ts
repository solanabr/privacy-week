"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { submissionForm } from "@/content/form";
import { getClientIp } from "@/lib/ip";
import { createSubmission, updateSubmissionByEditTokenHash } from "@/lib/db/submissions";
import { FLASH_COOKIE, type SubmissionFormState } from "@/lib/form-state";
import { isRateLimited } from "@/lib/ratelimit";
import { generateEditToken, hashEditToken, hashIp } from "@/lib/tokens";
import { validateSubmissionFormData } from "@/lib/validation";
import { getWindowState } from "@/lib/window";

const CLOSED_MESSAGES = {
  before: submissionForm.errors.notOpenYet,
  closed: submissionForm.errors.closed,
} as const;

function windowError(): SubmissionFormState | null {
  const state = getWindowState();
  if (state === "open") return null;
  return { status: "error", message: CLOSED_MESSAGES[state] };
}

async function hashClientIp(): Promise<string | null> {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) return null;
  const ip = await getClientIp();
  return hashIp(ip, salt);
}

export async function createSubmissionAction(
  _prevState: SubmissionFormState,
  formData: FormData,
): Promise<SubmissionFormState> {
  // Honeypot: pretend success, store nothing.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    redirect("/enviar/sucesso");
  }

  const closed = windowError();
  if (closed) return closed;

  const ipHash = await hashClientIp();
  if (await isRateLimited(ipHash)) {
    return { status: "error", message: submissionForm.errors.rateLimited };
  }

  const validation = validateSubmissionFormData(formData);
  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
      values: validation.values,
    };
  }

  const token = generateEditToken();

  try {
    await createSubmission(validation.data, {
      editTokenHash: hashEditToken(token),
      ipHash,
    });
  } catch (error) {
    console.error("Failed to create submission", error);
    return {
      status: "error",
      message: submissionForm.errors.generic,
      values: validation.values,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/enviar/sucesso",
    maxAge: 120,
  });

  redirect("/enviar/sucesso");
}

export async function updateSubmissionAction(
  token: string,
  _prevState: SubmissionFormState,
  formData: FormData,
): Promise<SubmissionFormState> {
  const closed = windowError();
  if (closed) return closed;

  const validation = validateSubmissionFormData(formData);
  if (!validation.success) {
    return {
      status: "error",
      fieldErrors: validation.fieldErrors,
      values: validation.values,
    };
  }

  try {
    const updated = await updateSubmissionByEditTokenHash(
      hashEditToken(token),
      validation.data,
    );
    if (!updated) {
      return { status: "error", message: submissionForm.errors.invalidToken };
    }
  } catch (error) {
    console.error("Failed to update submission", error);
    return {
      status: "error",
      message: submissionForm.errors.generic,
      values: validation.values,
    };
  }

  return { status: "saved", message: "Alterações salvas." };
}

export async function clearFlashCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete({ name: FLASH_COOKIE, path: "/enviar/sucesso" });
  redirect("/");
}
