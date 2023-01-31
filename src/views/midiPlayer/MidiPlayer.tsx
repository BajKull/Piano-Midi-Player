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
  return ReactDOM.createPortal(<DynamicMidiPlayerContent />, document.body);
};

export default MidiPlayer;
