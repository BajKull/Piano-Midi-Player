import React from "react";

const Lightning = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 50, 25]} intensity={1} />
      <directionalLight position={[0, 50, -25]} intensity={1} />
      <pointLight position={[-37, -9, -37]} intensity={0.05} />
    </>
  );
};

export default Lightning;
