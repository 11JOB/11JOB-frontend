import React from "react";
import clsx from "clsx";

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  type = "button",
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full rounded-xl h-12 font-semibold text-white transition-colors duration-150",
        disabled
          ? "bg-gray-500 cursor-not-allowed" // 비활성화 (회색)
          : "bg-black hover:bg-neutral-900 active:bg-neutral-950", // 활성화 (검정색)
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
