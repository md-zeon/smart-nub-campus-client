import {
  type FieldValues,
  type FieldPath,
  useController,
  type UseControllerProps,
} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  PasswordInput,
  PasswordInputField,
} from "@/components/forms/password-input";

interface PasswordFieldOwnProps {
  label?: string;
  description?: string;
  containerClassName?: string;
  showToggle?: boolean;
  toggleLabel?: { show: string; hide: string };
  disabled?: boolean;
}

type PasswordFieldProps<TFieldValues extends FieldValues> =
  PasswordFieldOwnProps &
    Pick<UseControllerProps<TFieldValues>, "control" | "name" | "rules">;

export function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  containerClassName,
  showToggle,
  toggleLabel,
  disabled,
}: PasswordFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: name as FieldPath<TFieldValues>,
    rules,
  });

  return (
    <PasswordInput
      value={String(field.value ?? "")}
      onChange={(val) => field.onChange(val)}
      disabled={disabled}
    >
      <Field className={containerClassName}>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <PasswordInputField showToggle={showToggle} toggleLabel={toggleLabel} />
        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldError errors={[error].filter(Boolean)} />
      </Field>
    </PasswordInput>
  );
}
