import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // lucide-react 설치 필요 (npm i lucide-react)
import clsx from "clsx";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          "w-full h-12 rounded-xl border border-gray-300 bg-white px-4 pr-10 text-gray-800",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800",
          "transition-colors duration-150",
          className
        )}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {visible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
