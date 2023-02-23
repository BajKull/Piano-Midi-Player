import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import cls from "./checkbox.module.scss";

export interface IProps extends InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = ({ className, ...props }: IProps) => {
  const clsButton = classNames(cls.checkbox, className);
  return (
    <label className="relative block h-5 w-5">
      <input type="checkbox" className={clsButton} {...props} />
    </label>
  );
};

export default Checkbox;
