import { useId } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type FieldMeta = {
  errors?: unknown[];
  isTouched?: boolean;
  isBlurred?: boolean;
};

export type StringFieldApi<TValue extends string = string> = {
  name: string;
  state: {
    value: TValue;
    meta: FieldMeta;
  };
  handleBlur: () => void;
  handleChange: (value: TValue) => void;
};

type FieldOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

export function getErrorMessages(error: unknown): string[] {
  if (!error) return [];
  if (typeof error === "string") return [error];
  if (Array.isArray(error)) return error.flatMap(getErrorMessages);

  if (typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return [error.message];
    }

    return Object.values(error).flatMap(getErrorMessages);
  }

  return [];
}

function uniqueMessages(errors: unknown[]) {
  return Array.from(new Set(errors.flatMap(getErrorMessages)));
}

function shouldShowFieldErrors(meta: FieldMeta) {
  return Boolean(meta.isTouched || meta.isBlurred);
}

export function FieldErrors({
  errors,
  id,
  show = true,
}: {
  errors: unknown[];
  id?: string;
  show?: boolean;
}) {
  const messages = show ? uniqueMessages(errors) : [];
  if (messages.length === 0) return null;

  return (
    <div id={id} role="alert" className="space-y-1">
      {messages.map((message) => (
        <p key={message} className="text-xs text-destructive">
          {message}
        </p>
      ))}
    </div>
  );
}

export function FormErrors({
  errors,
  show = true,
  className,
}: {
  errors: unknown[];
  show?: boolean;
  className?: string;
}) {
  const messages = show ? uniqueMessages(errors) : [];
  if (messages.length === 0) return null;

  return (
    <div
      role="alert"
      className={cn("space-y-1 text-sm text-destructive", className)}
    >
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

export function TextInputField<TValue extends string = string>({
  field,
  label,
  placeholder,
  type = "text",
  autoFocus,
  disabled,
}: {
  field: StringFieldApi<TValue>;
  label: string;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const showErrors = shouldShowFieldErrors(field.state.meta);
  const hasErrors =
    showErrors && uniqueMessages(field.state.meta.errors ?? []).length > 0;

  return (
    <label htmlFor={inputId} className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        id={inputId}
        name={field.name}
        autoFocus={autoFocus}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value as TValue)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? errorId : undefined}
        className={cn(
          hasErrors &&
            "border-destructive focus:border-destructive focus:ring-destructive/20",
        )}
      />
      <FieldErrors
        id={errorId}
        errors={field.state.meta.errors ?? []}
        show={showErrors}
      />
    </label>
  );
}

export function SelectField<TValue extends string = string>({
  field,
  label,
  options,
  placeholder,
  disabled,
}: {
  field: StringFieldApi<TValue>;
  label: string;
  options: Array<FieldOption<TValue>>;
  placeholder?: string;
  disabled?: boolean;
}) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const showErrors = shouldShowFieldErrors(field.state.meta);
  const hasErrors =
    showErrors && uniqueMessages(field.state.meta.errors ?? []).length > 0;

  return (
    <label htmlFor={inputId} className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select
        id={inputId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value as TValue)}
        disabled={disabled}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? errorId : undefined}
        className={cn(
          "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20",
          hasErrors &&
            "border-destructive focus:border-destructive focus:ring-destructive/20",
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrors
        id={errorId}
        errors={field.state.meta.errors ?? []}
        show={showErrors}
      />
    </label>
  );
}

export function RadioGroupField<TValue extends string = string>({
  field,
  label,
  options,
  disabled,
}: {
  field: StringFieldApi<TValue>;
  label: string;
  options: Array<FieldOption<TValue>>;
  disabled?: boolean;
}) {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const showErrors = shouldShowFieldErrors(field.state.meta);
  const hasErrors =
    showErrors && uniqueMessages(field.state.meta.errors ?? []).length > 0;

  return (
    <fieldset
      aria-invalid={hasErrors || undefined}
      aria-describedby={hasErrors ? errorId : undefined}
      className="flex min-w-0 flex-col gap-1.5"
    >
      <legend className="text-xs font-medium text-muted-foreground">
        {label}
      </legend>
      <div className="grid grid-cols-2 gap-2 pt-2">
        {options.map((option) => {
          const id = `${groupId}-${option.value.toLowerCase()}`;
          const isSelected = field.state.value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-2 text-sm transition-colors",
                disabled && "cursor-not-allowed opacity-60",
                isSelected
                  ? "border-blue-400 text-blue-900 dark:border-blue-500 dark:text-blue-100"
                  : "border-border bg-background text-foreground hover:bg-muted",
                hasErrors && "border-destructive",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
                  isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-muted-foreground",
                )}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <input
                type="radio"
                id={id}
                name={field.name}
                value={option.value}
                checked={isSelected}
                onBlur={field.handleBlur}
                onChange={() => field.handleChange(option.value)}
                disabled={disabled}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      <FieldErrors
        id={errorId}
        errors={field.state.meta.errors ?? []}
        show={showErrors}
      />
    </fieldset>
  );
}
