import React from "react";

import { useMemberByUsernameAll, usePing } from "./localAPIHooks";

type QueryTestComponentProps = {}

// React component
const QueryTestComponent : React.FC<QueryTestComponentProps> = (props) => {
  const memberRes = useMemberByUsernameAll("s9999997");

  const memberDisplay = () => {
    if (memberRes.isLoading) {
      return <span>Loading...</span>;
    }

    if (memberRes.data) {
      return <span>First name: {memberRes.data.first_name}</span>;
    }
  };

  const pingRes = usePing();

  const pingDisplay = () => {
    if (pingRes.isLoading) {
      return <span>Loading...</span>;
    }

    if (pingRes.data) {
      return <span>Ping: {pingRes.data.message}</span>;
    }

    if (pingRes.error) {
      return <span>Error: {pingRes.error.message}</span>;
    }
  };

  return (
    <>
      {pingDisplay()}
      <hr />
      {memberDisplay()}
    </>
  );
};


// Exports
export default QueryTestComponent;