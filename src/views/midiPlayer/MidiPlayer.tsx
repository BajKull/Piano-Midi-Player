import Loading from "components/loading/Loading";
import Modal from "components/modal/Modal";
import dynamic from "next/dynamic";
import React from "react";
import { useAppStore } from "store/store";

const DynamicMidiPlayerContent = dynamic(() => import("./MidiPlayerContent"), {
  loading: () => {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loading />
        <p className="mt-3 text-xl font-medium">Loading songs...</p>
      </div>
    );
  },
});

const MidiPlayer = () => {
  const { toggleMidiPanel, midiPanel } = useAppStore();
  return (
    <Modal closeFn={toggleMidiPanel} show={midiPanel}>
      <DynamicMidiPlayerContent />
    </Modal>
  );
};

export default MidiPlayer;
