import React from "react";

import { SNumberContextProvider } from "./SNumberContext";
import SNumberPadFrame from "./SNumberPadFrame";

// Props sent to SNumberPad
type SNumberPadProps = {
  login : (username : string) => void,
}

// SNumberPad which acts as a wrapper for the SNumberContext and the SNumberPadFramef
const SNumberPad : React.FC<SNumberPadProps> = (props) => {
  // Wrap the actual SNumberPad in the provider used to make the buttons work
  return <SNumberContextProvider> {/* Context provider for SNumber */}
    <SNumberPadFrame login={props.login} />
  </SNumberContextProvider>;
};

// Exports
export default SNumberPad;
