import React, { createContext, Dispatch, useContext, useState } from "react";
import { getMemberById, getMemberByUsername, MemberType, ping, PingType } from "./localAPI";

// Context type to pass along
type APIContextType = {
  loading : boolean
  setLoading : Dispatch<boolean>

  /**
   * Send a ping to the local API server.
   */
  ping : () => Promise<PingType>

  /**
   * Get a member by their username (SNumber)
   * @param {string} username SNumber
   */
  getMemberByUsername : (username : string) => Promise<MemberType>

  /**
   * Get a member by their Congressus ID (not SNumber!)
   * @param {string} id Congressus ID
   */
  getMemberById : (id : number) => Promise<MemberType>
}

// Actual context, store of the current state
const APIContext = createContext<APIContextType>({} as APIContextType);

// Custom hook to use the APIContext
const useAPI = () : APIContextType => {
  return useContext(APIContext);
};

// React component
const APIContextProvider : React.FC = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <APIContext.Provider value={{
      loading: loading,
      setLoading: setLoading,
      ping: ping,
      getMemberByUsername: getMemberByUsername,
      getMemberById: getMemberById,
    }}>
      {props.children}
    </APIContext.Provider>
  );
};

// Exports
export default APIContext;
export { APIContextProvider, useAPI };
export type { APIContextType };