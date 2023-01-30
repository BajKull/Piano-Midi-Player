import classNames from "classnames";
import React from "react";
import cls from "./button.module.scss";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const Button = ({ children, active, className, ...rest }: IProps) => {
  const clsButton = classNames(className, cls.button, { [cls.active]: active });
  return (
    <button className={clsButton} {...rest}>
      {children}
    </button>
  );
};

export default Button;
