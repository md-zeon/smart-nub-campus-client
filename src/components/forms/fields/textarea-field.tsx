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
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldOwnProps {
  label?: string;
  description?: string;
  containerClassName?: string;
}

type TextareaFieldProps<TFieldValues extends FieldValues> =
  TextareaFieldOwnProps &
    Pick<UseControllerProps<TFieldValues>, "control" | "name" | "rules"> &
    Omit<React.ComponentProps<typeof Textarea>, "name">;

export function TextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  containerClassName,
  className,
  ...props
}: TextareaFieldProps<TFieldValues>) {
  const {
    field: { ref: fieldRef, ...fieldProps },
    fieldState: { error },
  } = useController({
    control,
    name: name as FieldPath<TFieldValues>,
    rules,
  });

  return (
    <Field className={containerClassName}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <Textarea
        id={name}
        ref={fieldRef}
        className={className}
        aria-invalid={!!error}
        {...fieldProps}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error].filter(Boolean)} />
    </Field>
  );
}
