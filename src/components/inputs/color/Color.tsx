import classNames from "classnames";
import React, { useState } from "react";
import cls from "./color.module.scss";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Color = ({ children, className, ...props }: IProps) => {
  const clsLabel = classNames(
    "relative inline-flex w-full cursor-pointer items-center",
    className
  );

  return (
    <label className={clsLabel}>
      <span className="mr-3 text-sm font-medium">{children}</span>
      <div className="ml-auto mr-3">
        <input type="color" className={cls.colorInput} {...props} />
      </div>
    </label>
  );
};

export default Color;
