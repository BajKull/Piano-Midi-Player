import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import colors from "tailwindcss/colors";
import classNames from "classnames";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  clearFn: () => void;
}

const SearchBar = ({ clearFn, ...props }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const clsIcon = classNames(
    "w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2",
    { "cursor-text": !props.value, "cursor-pointer": props.value }
  );
  return (
    <div className="relative w-full">
      <input
        className="w-full container-shadow bg-indigo-50 pr-8 py-2 rounded-full pl-3 text-sm"
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
