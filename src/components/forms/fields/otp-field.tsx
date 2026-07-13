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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/forms/input-otp";

interface OTPFieldOwnProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  disabled?: boolean;
}

type OTPFieldProps<TFieldValues extends FieldValues> = OTPFieldOwnProps &
  Pick<UseControllerProps<TFieldValues>, "control" | "name" | "rules">;

export function OTPField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  containerClassName,
  disabled,
}: OTPFieldProps<TFieldValues>) {
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
      <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
        <InputOTP
          maxLength={6}
          value={String(field.value ?? "")}
          onChange={(value) => field.onChange(value)}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={[error].filter(Boolean)} />
    </Field>
  );
}
