import { type ReactNode, type ButtonHTMLAttributes } from "react";
import "./button.css";

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  className = className ? `button solid ${className}` : "button solid";
  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}
