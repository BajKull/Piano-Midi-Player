import classNames from "classnames";
import React from "react";
import cls from "./button.module.scss";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  noBg?: boolean;
  callToAction?: boolean;
}

const Button = ({
  children,
  noBg,
  active,
  callToAction,
  className,
  ...rest
}: IButtonProps) => {
  const clsButton = classNames(
    className,
    "px-3 py-1 transition-colors disabled:cursor-not-allowed",
    {
      "bg-indigo-200 hover:bg-indigo-200 container-shadow": active && !noBg,
      "bg-indigo-50 hover:bg-indigo-100 container-shadow": !noBg && !active,
      "bg-transparent": noBg,
      "bg-indigo-500 text-white rounded-md hover:bg-indigo-600": callToAction,
    }
  );
  return (
    <button className={clsButton} {...rest}>
      {children}
    </button>
  );
};

export default Button;
