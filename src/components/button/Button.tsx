import React from "react";
import "./Button.scss";

interface Props {
  title: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}

const Button: React.FC<Props> = ({ onClick, title, className }) => {
  return (
    <button
      onClick={onClick}
      className={`pure-material-button-contained  ${className} `}
    >
      {title}
    </button>
  );
};

export default Button;
