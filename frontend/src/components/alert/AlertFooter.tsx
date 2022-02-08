import React from "react";
import TimedAlert from "./TimedAlert";


type AlertFooterProps = {}

// React component
const AlertFooter : React.FC<AlertFooterProps> = (props) => {

  return (
    <footer>
      <TimedAlert />
    </footer>
  );
}


// Exports
export default AlertFooter;