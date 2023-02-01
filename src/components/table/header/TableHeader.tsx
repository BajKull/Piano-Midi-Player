import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  field: string;
  sort: { field: string; how: "asc" | "desc" } | null;
}

const TableHeader = ({ sort, name, field, className, ...props }: IProps) => {
  const clsDiv = classNames(
    "flex items-center text-left font-semibold",
    className
  );
  return (
    <div className={clsDiv}>
      <button className="flex items-center text-left font-semibold" {...props}>
        {name}
        {sort?.field === field && sort.how === "asc" && (
          <FontAwesomeIcon icon={faSortUp} className="ml-1 h-5 w-5" />
        )}
        {sort?.field === field && sort.how === "desc" && (
          <FontAwesomeIcon icon={faSortDown} className="ml-1 h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default TableHeader;
