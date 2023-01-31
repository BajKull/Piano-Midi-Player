import CloseButton from "components/button/closeButton/CloseButton";
import React from "react";
import ReactDOM from "react-dom";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  closeFn: () => void;
}

const Modal = ({ children, closeFn, ...props }: IProps) => {
  return ReactDOM.createPortal(
    <div className="w-100 h-100 fixed z-10 bg-black bg-opacity-40">
      <div
        className="container-shadow fixed top-1/2 left-1/2 z-20 flex h-5/6 min-h-[350px] w-11/12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded bg-indigo-50 p-5 md:h-2/3 md:w-3/4 xl:w-2/3"
        {...props}
      >
        <div className="relative h-full w-full">
          {children}
          <CloseButton
            className="absolute top-0 right-0"
            onClick={() => closeFn()}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
