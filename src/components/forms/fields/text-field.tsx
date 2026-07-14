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
import { Input } from "@/components/ui/input";

interface TextFieldOwnProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

type TextFieldProps<TFieldValues extends FieldValues> = TextFieldOwnProps &
  Omit<React.ComponentProps<typeof Input>, "name"> &
  Pick<UseControllerProps<TFieldValues>, "control" | "name" | "rules">;

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  containerClassName,
  className,
  ...props
}: TextFieldProps<TFieldValues>) {
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
      <Input
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
