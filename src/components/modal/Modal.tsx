import CloseButton from "components/button/closeButton/CloseButton";
import React from "react";
import ReactDOM from "react-dom";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  closeFn: () => void;
}

const Modal = ({ children, closeFn, ...props }: IProps) => {
  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 z-10 flex h-full w-full items-center justify-center">
      <div
        className="absolute -z-10 h-full w-full cursor-pointer bg-black bg-opacity-20"
        onClick={() => closeFn()}
      />
      <div
        className="container-shadow flex h-5/6 min-h-[350px] w-11/12 items-center justify-center rounded bg-indigo-50 p-5 md:h-2/3 md:w-3/4 xl:w-2/3"
        {...props}
      >
        <div className="relative h-full w-full">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
