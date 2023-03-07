import classNames from "classnames";
import React, { useState } from "react";
import cls from "./color.module.scss";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Color = ({ children, className, ...props }: IProps) => {
  const clsLabel = classNames(
    "relative inline-flex w-full cursor-pointer items-center",
    className
  );

  const clsInput = classNames(
    "container-shadow h-6 w-6 cursor-pointer appearance-none rounded-full border-0 p-0",
    cls.colorInput
  );

  return (
    <label className={clsLabel}>
      <span className="mr-3 text-sm font-medium">{children}</span>
      <div className="ml-auto mr-[10px] flex items-center">
        <input type="color" className={clsInput} {...props} />
      </div>
    </label>
  );
};

export default Color;
