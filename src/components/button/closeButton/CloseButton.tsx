import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button, { IButtonProps } from "../Button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

const CloseButton = ({ className, ...props }: IButtonProps) => {
  const clsButton = classNames("h-10 w-10", className);
  return (
    <Button aria-label="Close" className={clsButton} noBg {...props}>
      <FontAwesomeIcon icon={faXmark} />
    </Button>
  );
};

export default CloseButton;
