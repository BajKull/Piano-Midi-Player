import Loading from "components/loading/Loading";
import dynamic from "next/dynamic";
import React from "react";
import ReactDOM from "react-dom";

const DynamicMidiPlayerContent = dynamic(() => import("./MidiPlayerContent"), {
  loading: () => (
    <div className="flex flex-col items-center">
      <Loading />
      <p className="mt-3 text-xl font-medium">Loading songs...</p>
    </div>
  ),
});

const MidiPlayer = () => {
  return ReactDOM.createPortal(
    <div className="container-shadow fixed top-1/2 left-1/2 z-10 flex h-5/6 min-h-[350px] w-11/12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded bg-indigo-50 p-5 md:h-2/3 md:w-3/4 xl:w-2/3">
      <DynamicMidiPlayerContent />
    </div>,
    document.body
  );
};

export default MidiPlayer;
