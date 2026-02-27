import { type InputHTMLAttributes } from "react";

// TODO(jw): minus the type
type NumberFieldProps = InputHTMLAttributes<HTMLInputElement>;

export default function NumberField({ ...props }: NumberFieldProps) {
  return <input type="number" {...props} />;
}
