import React, { createContext, Dispatch, useContext, useState } from "react";
import { UseQueryResult } from "react-query";
import { useAlert } from "../components/alert/AlertContext";
import { timeoutAlert, unknownErrorAlert, usernameNotFoundAlert } from "../components/alert/standardAlerts";
import { FolderType, getMemberById, getMemberByUsername, LocalAPIError, MemberType, ping, PingType } from "./localAPI";
import { useFolders } from "./localAPIHooks";

// Context type to pass along
type APIContextType = {

  // All folders in the Streeplijst API
  folderRes : UseQueryResult<FolderType[], LocalAPIError>
}

// Actual context, store of the current state
const APIContext = createContext<APIContextType>({} as APIContextType);

// Custom hook to use the APIContext
const useAPI = () : APIContextType => {
  return useContext(APIContext);
};

// React component
const APIContextProvider : React.FC = (props) => {
  const alert = useAlert();

  // Callback function to set the alert upon a failed folders request
  const onFolderError = (error : LocalAPIError) : void => {
    switch (error.status) {  // Determine the error type
      case 408:  // Request timeout
        alert.set(timeoutAlert(error.toString()));  // Set alert
        break;
      default:// All other checks failed, this is an unexpected error so set the alert to an unknown error
        console.log(error);
        alert.set(unknownErrorAlert(error.toString()));
    }
  };

  const folderRes = useFolders(
    {
      onError: onFolderError,
    },
    {
      staleTime: 3 * 60 * 60 * 1000,  // Default stale time (time between periodic refetching the data) is 3 hours
    },
  );

  return (
    <APIContext.Provider value={{
      folderRes: folderRes,
    }}>
      {props.children}
    </APIContext.Provider>
  );
};

// Exports
export default APIContext;
export { APIContextProvider, useAPI };
export type { APIContextType };