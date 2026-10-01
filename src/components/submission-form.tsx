"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { submissionForm } from "@/content/form";
import {
  categoryLabels,
  proofTypeHelp,
  proofTypeLabels,
  techLabels,
} from "@/content/labels";
import { initialFormState, type SubmissionFormState } from "@/lib/form-state";
import {
  CATEGORIES,
  countWords,
  MAX_MEMBERS,
  MAX_WRITEUP_WORDS,
  PROOF_TYPES,
  TECHS,
  type MemberFormValue,
  type SubmissionFormValues,
} from "@/lib/validation";

import { CutButton, CutLink } from "./cut-button";
import { Field, inputClass, textareaClass } from "./field";

interface SubmissionFormProps {
  action: (
    state: SubmissionFormState,
    formData: FormData,
  ) => Promise<SubmissionFormState>;
  initialValues: SubmissionFormValues;
  submitLabel: string;
  requireXAccount?: boolean;
  connectedXUsername?: string | null;
  xConnectionError?: string | null;
}

interface MemberRow extends MemberFormValue {
  id: number;
}

let memberId = 0;

function SubmitButton({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <CutButton type="submit" size="lg" disabled={pending || disabled}>
      {pending ? submissionForm.submitting : label}
    </CutButton>
  );
}

/** A numbered section of the form, drawn as a sticker card. */
function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="sticker p-5 sm:p-7">
      <legend className="float-left mb-6 flex w-full items-center gap-3 border-b-2 border-ink/10 pb-4">
        <span className="numeral numeral-fill text-2xl text-emerald-deep">{number}</span>
        <span className="u-display text-xl sm:text-2xl">{title}</span>
      </legend>
      <div className="clear-both flex flex-col gap-6">{children}</div>
    </fieldset>
  );
}

export function SubmissionForm({
  action,
  initialValues,
  submitLabel,
  requireXAccount = false,
  connectedXUsername = null,
  xConnectionError = null,
}: SubmissionFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  const fieldErrors = state.fieldErrors ?? {};
  const values = state.values ?? initialValues;

  const [writeup, setWriteup] = useState(values.writeup);
  const [proofType, setProofType] = useState(values.proof_type);
  const [members, setMembers] = useState<MemberRow[]>(
    values.members.map((member) => ({ ...member, id: memberId++ })),
  );

  const words = countWords(writeup);

  function addMember() {
    if (members.length >= MAX_MEMBERS) return;
    setMembers((current) => [
      ...current,
      { id: memberId++, name: "", x: "", github: "" },
    ]);
  }

  function removeMember(id: number) {
    setMembers((current) => current.filter((member) => member.id !== id));
  }

  function updateMember(id: number, patch: Partial<MemberFormValue>) {
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate={false}>
      {state.message ? (
        <p
          role="alert"
          className={`sticker-sm p-4 text-sm font-semibold ${
            state.status === "saved" ? "text-emerald-deep" : "text-danger"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      {/* Honeypot */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">{submissionForm.honeypotLabel}</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {requireXAccount ? (
        <fieldset
          className={`${
            connectedXUsername ? "sticker" : "sticker-yellow"
          } flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}
        >
          <legend className="sr-only">{submissionForm.xConnection.title}</legend>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="hat">{submissionForm.xConnection.title}</p>
            <p className="font-display text-lg font-black leading-snug">
              {connectedXUsername
                ? submissionForm.xConnection.connected(connectedXUsername)
                : submissionForm.xConnection.disconnected}
            </p>
            <p className="text-xs leading-relaxed text-ink-soft">
              {submissionForm.xConnection.privacy}
            </p>
            {xConnectionError ? (
              <p role="alert" className="text-xs font-semibold text-danger">
                {xConnectionError}
              </p>
            ) : null}
          </div>
          <CutLink
            href="/auth/x/start"
            variant={connectedXUsername ? "outline" : "ink"}
            className="shrink-0"
          >
            {connectedXUsername
              ? submissionForm.xConnection.change
              : submissionForm.xConnection.connect}
          </CutLink>
        </fieldset>
      ) : null}

      {/* Project */}
      <FormSection number="01" title={submissionForm.sections.project}>
        <Field
          label={submissionForm.fields.project_name.label}
          htmlFor="project_name"
          required
          error={fieldErrors.project_name}
        >
          <input
            id="project_name"
            name="project_name"
            defaultValue={values.project_name}
            maxLength={80}
            required
            className={inputClass}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={submissionForm.fields.team_name.label}
            htmlFor="team_name"
            help={submissionForm.fields.team_name.help}
            alignControl
            error={fieldErrors.team_name}
          >
            <input
              id="team_name"
              name="team_name"
              defaultValue={values.team_name}
              maxLength={80}
              className={inputClass}
            />
          </Field>

          <Field
            label={submissionForm.fields.tagline.label}
            htmlFor="tagline"
            required
            alignControl
            error={fieldErrors.tagline}
          >
            <input
              id="tagline"
              name="tagline"
              defaultValue={values.tagline}
              maxLength={140}
              required
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={submissionForm.fields.category.label}
            htmlFor="category"
            required
            alignControl
            error={fieldErrors.category}
          >
            <select
              id="category"
              name="category"
              defaultValue={values.category || ""}
              required
              className={inputClass}
            >
              <option value="" disabled>
                Selecione
              </option>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {categoryLabels[value]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={submissionForm.fields.tech.label}
            htmlFor="tech"
            help={submissionForm.fields.tech.help}
            required
            alignControl
            error={fieldErrors.tech}
          >
            <select
              id="tech"
              name="tech"
              defaultValue={values.tech || ""}
              required
              className={inputClass}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TECHS.map((value) => (
                <option key={value} value={value}>
                  {techLabels[value]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label={submissionForm.fields.repo_url.label}
          htmlFor="repo_url"
          required
          error={fieldErrors.repo_url}
        >
          <input
            id="repo_url"
            name="repo_url"
            type="url"
            inputMode="url"
            placeholder={submissionForm.fields.repo_url.placeholder}
            defaultValue={values.repo_url}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label={submissionForm.fields.sprint_changes.label}
          htmlFor="sprint_changes"
          help={submissionForm.fields.sprint_changes.help}
          required
          error={fieldErrors.sprint_changes}
        >
          <textarea
            id="sprint_changes"
            name="sprint_changes"
            defaultValue={values.sprint_changes}
            maxLength={300}
            required
            className={`${inputClass} min-h-24`}
          />
        </Field>
      </FormSection>

      {/* Proof */}
      <FormSection number="02" title={submissionForm.sections.proof}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={submissionForm.fields.proof_type.label}
            htmlFor="proof_type"
            required
            alignControl
            error={fieldErrors.proof_type}
          >
            <select
              id="proof_type"
              name="proof_type"
              value={proofType}
              onChange={(event) => setProofType(event.target.value)}
              required
              className={inputClass}
            >
              {PROOF_TYPES.map((value) => (
                <option key={value} value={value}>
                  {proofTypeLabels[value]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={submissionForm.fields.proof_value.label}
            htmlFor="proof_value"
            help={
              proofTypeHelp[proofType as keyof typeof proofTypeHelp] ??
              proofTypeHelp.solana_tx
            }
            required
            alignControl
            error={fieldErrors.proof_value}
          >
            <input
              id="proof_value"
              name="proof_value"
              defaultValue={values.proof_value}
              required
              className={`${inputClass} font-mono text-sm`}
            />
          </Field>
        </div>

        <Field
          label={submissionForm.fields.demo_video_url.label}
          htmlFor="demo_video_url"
          help={submissionForm.fields.demo_video_url.help}
          required
          error={fieldErrors.demo_video_url}
        >
          <input
            id="demo_video_url"
            name="demo_video_url"
            type="url"
            inputMode="url"
            defaultValue={values.demo_video_url}
            required
            className={inputClass}
          />
        </Field>

        <Field
          label={submissionForm.fields.writeup.label}
          htmlFor="writeup"
          required
          error={fieldErrors.writeup}
        >
          <p className="sticker-kraft mb-3 p-4 text-sm leading-relaxed">
            {submissionForm.fields.writeup.prompt}
          </p>
          <textarea
            id="writeup"
            name="writeup"
            value={writeup}
            onChange={(event) => setWriteup(event.target.value)}
            required
            className={textareaClass}
          />
          <p
            className={`mt-2 u-mono ${
              words > MAX_WRITEUP_WORDS ? "text-danger" : "text-muted"
            }`}
            aria-live="polite"
          >
            {words} / {MAX_WRITEUP_WORDS} palavras
          </p>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={submissionForm.fields.colosseum_url.label}
            htmlFor="colosseum_url"
            help={submissionForm.fields.colosseum_url.help}
            alignControl
            error={fieldErrors.colosseum_url}
          >
            <input
              id="colosseum_url"
              name="colosseum_url"
              type="url"
              inputMode="url"
              defaultValue={values.colosseum_url}
              className={inputClass}
            />
          </Field>

          <Field
            label={submissionForm.fields.website_url.label}
            htmlFor="website_url"
            help={submissionForm.fields.website_url.help}
            alignControl
            error={fieldErrors.website_url}
          >
            <input
              id="website_url"
              name="website_url"
              type="url"
              inputMode="url"
              defaultValue={values.website_url}
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {/* Team */}
      <FormSection number="03" title={submissionForm.sections.team}>
        <p className="text-sm text-muted">{submissionForm.fields.members.help}</p>

        {fieldErrors.members ? (
          <p role="alert" className="text-xs font-semibold text-danger">
            {fieldErrors.members}
          </p>
        ) : null}

        <ul className="flex flex-col gap-4">
          {members.map((member, index) => (
            <li
              key={member.id}
              className="border-2 border-ink/15 bg-surface p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="u-mono text-emerald-deep">
                  {submissionForm.fields.memberRow} {index + 1}
                </span>
                {members.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="u-mono text-danger underline underline-offset-4"
                  >
                    {submissionForm.fields.remove_member}
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label={submissionForm.fields.member_name}
                  htmlFor={`members[${index}].name`}
                  required
                >
                  <input
                    id={`members[${index}].name`}
                    name={`members[${index}].name`}
                    value={member.name}
                    onChange={(event) =>
                      updateMember(member.id, { name: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  label={submissionForm.fields.member_x}
                  htmlFor={`members[${index}].x`}
                >
                  <input
                    id={`members[${index}].x`}
                    name={`members[${index}].x`}
                    value={member.x}
                    onChange={(event) =>
                      updateMember(member.id, { x: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field
                  label={submissionForm.fields.member_github}
                  htmlFor={`members[${index}].github`}
                >
                  <input
                    id={`members[${index}].github`}
                    name={`members[${index}].github`}
                    value={member.github}
                    onChange={(event) =>
                      updateMember(member.id, { github: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
            </li>
          ))}
        </ul>

        {members.length < MAX_MEMBERS ? (
          <div>
            <CutButton type="button" variant="outline" size="sm" onClick={addMember}>
              {submissionForm.fields.add_member}
            </CutButton>
          </div>
        ) : null}

        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            name="show_members"
            defaultChecked={values.show_members}
            className="h-5 w-5 accent-emerald"
          />
          {submissionForm.fields.show_members}
        </label>
      </FormSection>

      {/* Contact */}
      <FormSection number="04" title={submissionForm.sections.contact}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={submissionForm.fields.contact_name.label}
            htmlFor="contact_name"
            required
            alignControl
            error={fieldErrors.contact_name}
          >
            <input
              id="contact_name"
              name="contact_name"
              defaultValue={values.contact_name}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label={submissionForm.fields.contact_email.label}
            htmlFor="contact_email"
            help={submissionForm.fields.contact_email.help}
            required
            alignControl
            error={fieldErrors.contact_email}
          >
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              defaultValue={values.contact_email}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label={submissionForm.fields.contact_telegram.label}
            htmlFor="contact_telegram"
            help={submissionForm.fields.contact_telegram.help}
            alignControl
            error={fieldErrors.contact_telegram}
          >
            <input
              id="contact_telegram"
              name="contact_telegram"
              defaultValue={values.contact_telegram}
              className={inputClass}
            />
          </Field>
          <Field
            label={submissionForm.fields.contact_whatsapp.label}
            htmlFor="contact_whatsapp"
            help={submissionForm.fields.contact_whatsapp.help}
            alignControl
            error={fieldErrors.contact_whatsapp}
          >
            <input
              id="contact_whatsapp"
              name="contact_whatsapp"
              defaultValue={values.contact_whatsapp}
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {/* Consent */}
      <FormSection number="05" title={submissionForm.sections.consent}>
        <label className="flex items-start gap-3 text-sm font-semibold leading-relaxed">
          <input
            type="checkbox"
            name="accepted_rules"
            defaultChecked={values.accepted_rules}
            required
            className="mt-0.5 h-5 w-5 shrink-0 accent-emerald"
          />
          <span>{submissionForm.fields.accepted_rules}</span>
        </label>
        {fieldErrors.accepted_rules ? (
          <p role="alert" className="text-xs font-semibold text-danger">
            {fieldErrors.accepted_rules}
          </p>
        ) : null}
      </FormSection>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton
          label={submitLabel}
          disabled={requireXAccount && !connectedXUsername}
        />
        <span className="text-xs text-muted">{submissionForm.requiredHint}</span>
      </div>
    </form>
  );
}
