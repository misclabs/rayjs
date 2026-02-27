import { type ReactNode, type ButtonHTMLAttributes } from "react";
import "./control-style.css";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} {...props}>
      {children}
    </button>
  );
}
