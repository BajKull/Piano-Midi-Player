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
    "h-1 w-full cursor-pointer appearance-none rounded-lg accent-indigo-500"
  );

  return (
    <input
      type="range"
      className="h-1 w-full cursor-pointer appearance-none rounded-lg accent-indigo-500"
      style={{
        background: `linear-gradient(to right, ${colors.indigo[600]} 0%, ${colors.indigo[500]} ${volume}%, ${colors.slate[200]} ${volume}%, ${colors.slate[200]} 100%`,
      }}
      {...rest}
    />
  );
};

export default Range;
