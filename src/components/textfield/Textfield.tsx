import React from "react";
import "./TextField.scss";

interface Props {
  type: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<Props> = ({
  type,
  id,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="form__group">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="form__field"
        placeholder={placeholder}
      />
      <label htmlFor={id} className="form__label">
        {placeholder}
      </label>
    </div>
  );
};

export default TextField;
