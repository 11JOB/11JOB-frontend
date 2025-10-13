import React from "react";
import clsx from "clsx";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx(
        "w-full h-12 rounded-xl border border-gray-300 bg-white px-4 text-gray-800",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800",
        "transition-colors duration-150",
        className
      )}
    />
  );
};

export default Input;
