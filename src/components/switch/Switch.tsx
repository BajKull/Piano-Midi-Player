import classNames from "classnames";
import React from "react";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Switch = ({ children, className, ...props }: IProps) => {
  const clsInput = classNames(
    "peer ml-auto h-6 w-11 min-w-[44px] rounded-full bg-indigo-200 after:absolute after:top-1/2 after:right-[22px] after:h-5 after:w-5 after:-translate-y-1/2 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-indigo-300",
    className
  );
  return (
    <label className="relative inline-flex w-full cursor-pointer items-center">
      <span className="mr-3 text-sm font-medium">{children}</span>
      <input type="checkbox" value="" className="peer sr-only" {...props} />
      <div className={clsInput}></div>
    </label>
  );
};

export default Switch;
