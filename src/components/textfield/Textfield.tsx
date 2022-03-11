import React from "react";
import "./TextField.scss";

interface Props {
  type: string;
  id: string;
  placeholder: string;
  value?: string;
  min?: number;
  max?: number;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<Props> = ({
  type,
  id,
  placeholder,
  value,
  min,
  max,
  label,
  onChange,
}) => {
  return (
    <div className={"form__group"}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={"form__field"}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default TextField;
