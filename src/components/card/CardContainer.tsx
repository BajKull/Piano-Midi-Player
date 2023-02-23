import classNames from "classnames";
import React, { HTMLAttributes } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  height?: string;
}

const CardContainer = ({
  height = "auto",
  className,
  children,
  ...props
}: IProps) => {
  const clsDiv = classNames(className, "custom-scroll overflow-y-scroll pr-5");
  return (
    <div className={clsDiv} {...props} style={{ height }}>
      {children}
    </div>
  );
};

export default CardContainer;
