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
    field,
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
        value={String(field.value ?? "")}
        onChange={(e) => field.onChange(e.target.value)}
        onBlur={field.onBlur}
        ref={field.ref}
        className={className}
        aria-invalid={!!error}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error].filter(Boolean)} />
    </Field>
  );
}
