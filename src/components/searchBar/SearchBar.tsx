import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  clearFn: () => void;
}

const SearchBar = ({ clearFn, className, ...props }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const clsIcon = classNames(
    "absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2",
    { "cursor-text": !props.value, "cursor-pointer": props.value }
  );
  const clsInput = classNames(
    "container-shadow w-full rounded-full bg-indigo-50 py-2 pr-8 pl-3 text-sm",
    className
  );
  return (
    <div className="relative w-full">
      <input
        className={clsInput}
        placeholder="Search..."
        ref={inputRef}
        {...props}
      />
      <FontAwesomeIcon
        icon={props.value ? faXmark : faMagnifyingGlass}
        className={clsIcon}
        onClick={() => (props.value ? clearFn() : inputRef.current?.focus())}
      />
    </div>
  );
};

export default SearchBar;
