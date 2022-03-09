import React from "react";
import "./TextField.scss";

interface Props {
  type: string;
  id: string;
  placeholder: string;
  value?: string;
  pattern?: string;
  label?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<Props> = ({
  type,
  id,
  placeholder,
  value,
  pattern,
  label = true,
  onChange,
}) => {
  return (
    <div className={label ? "form__group" : undefined}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="form__field"
        placeholder={placeholder}
        pattern={pattern}
      />
      {label && (
        <label htmlFor={id} className="form__label">
          {placeholder}
        </label>
      )}
    </div>
  );
};

export default TextField;
