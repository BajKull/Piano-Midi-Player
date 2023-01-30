import Loading from "components/loading/Loading";
import dynamic from "next/dynamic";
import React from "react";
import ReactDOM from "react-dom";

const DynamicMidiPlayerContent = dynamic(() => import("./MidiPlayerContent"), {
  loading: () => (
    <div className="flex flex-col items-center">
      <Loading />
      <p className="mt-3 font-medium text-xl">Loading songs...</p>
    </div>
  ),
});

const MidiPlayer = () => {
  return ReactDOM.createPortal(
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 container-shadow bg-indigo-50 p-5 rounded xl:w-1/2 xl:h-1/2 md:w-2/3 md:h-2/3 w-11/12 h-5/6 flex justify-center items-center">
      <DynamicMidiPlayerContent />
    </div>,
    document.body
  );
};

export default MidiPlayer;
