import classNames from "classnames";
import React from "react";
import { useAppStore } from "store/store";
import colors from "tailwindcss/colors";
import cls from "./range.module.scss";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Range = ({ children, className, ...rest }: IProps) => {
  const { volume } = useAppStore();
  const clsRange = classNames(
    className,
    cls.range,
    "w-full h-1 rounded-lg appearance-none cursor-pointer range-sm accent-indigo-500"
  );

  return (
    <input
      type="range"
      className={clsRange}
      style={{
        background: `linear-gradient(to right, ${colors.indigo[600]} 0%, ${colors.indigo[500]} ${volume}%, ${colors.slate[200]} ${volume}%, ${colors.slate[200]} 100%`,
      }}
      {...rest}
    />
  );
};

export default Range;
