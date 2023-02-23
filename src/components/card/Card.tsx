import classNames from "classnames";
import React, { HTMLAttributes } from "react";

const Card = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const clsDiv = classNames(
    className,
    "flex w-full items-center rounded-lg p-5 hover:bg-indigo-100"
  );
  return (
    <div className={clsDiv} {...props}>
      {children}
    </div>
  );
};

export default Card;
