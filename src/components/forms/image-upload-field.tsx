import {
  type FieldValues,
  type FieldPath,
  useController,
  type UseControllerProps,
} from "react-hook-form";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { ImageUpload } from "@/app/(auth)/auth/onboarding/_components/ImageUpload";

interface ImageUploadFieldOwnProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

type ImageUploadFieldProps<TFieldValues extends FieldValues> =
  ImageUploadFieldOwnProps &
    Omit<
      React.ComponentProps<typeof ImageUpload>,
      "value" | "onChange" | "error"
    > &
    Pick<UseControllerProps<TFieldValues>, "control" | "name" | "rules">;

export function ImageUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  label,
  description,
  containerClassName,
  ...props
}: ImageUploadFieldProps<TFieldValues>) {
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
      <ImageUpload
        value={field.value}
        onChange={field.onChange}
        error={error?.message}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
