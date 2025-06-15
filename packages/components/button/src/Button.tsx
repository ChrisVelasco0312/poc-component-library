import React from "react";
import styles from "./Button.module.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Is this the principal call to action on the page?
   */
  variant?: "primary" | "secondary";
  /**
   * Button contents
   */
  children: React.ReactNode;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) => {
  const variantClass =
    variant === "primary" ? styles.primary : styles.secondary;
  const combinedClassName = [styles.button, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
