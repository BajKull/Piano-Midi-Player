import classNames from "classnames";
import React from "react";
import cls from "./button.module.scss";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  noBg?: boolean;
}

const Button = ({
  children,
  noBg,
  active,
  className,
  ...rest
}: IButtonProps) => {
  const clsButton = classNames(className, "px-3 py-1 transition-colors", {
    "bg-indigo-200 hover:bg-indigo-200 container-shadow": active && !noBg,
    "bg-indigo-50 hover:bg-indigo-100 container-shadow": !noBg && !active,
    "bg-transparent": noBg,
  });
  console.log(active);
  return (
    <button className={clsButton} {...rest}>
      {children}
    </button>
  );
};

export default Button;
