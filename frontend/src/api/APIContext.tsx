import React, { createContext, useContext, useState } from "react";
import { UseQueryResult } from "react-query";
import { useAlert } from "../components/alert/AlertContext";
import { timeoutAlert, unknownErrorAlert } from "../components/alert/standardAlerts";
import { FolderType, LocalAPIError, ProductType } from "./localAPI";
import { useFolders, useProducts } from "./localAPIHooks";

// Context type to pass along
type APIContextType = {
  // All folders in the Streeplijst API
  folderRes : UseQueryResult<FolderType[], LocalAPIError>

  /**
   * Function to select a folder so that the products in that folder are loaded.
   * @param folderId Folder ID to get the products for
   * @returns React-query result for the products in a folder
   */
  getProductsInFolder : (folderId : number) => UseQueryResult<ProductType[], LocalAPIError>
}

// Default time for which the data is considered fresh and should not be fetched again (to make the app fast), since
// data on the API changes almost never
const defaultFreshTime = 3 * 60 * 60 * 1000;  // 3 hours

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
      staleTime: defaultFreshTime,  // Default stale time (time between periodic refetching the data) is 3 hours
    },
  );

  // Currently selected folder ID, 0 indicates no folder selected
  const [currFolderId, setCurrFolderId] = useState<number>(0);

  // Callback function to set the alert upon a failed folders request
  const onProductsError = (error : LocalAPIError, folderId : number) : void => {
    switch (error.status) {  // Determine the error type
      case 408:  // Request timeout
        alert.set(timeoutAlert(error.toString()));  // Set alert
        break;
      default:// All other checks failed, this is an unexpected error so set the alert to an unknown error
        console.log(error);
        alert.set(unknownErrorAlert(error.toString()));
    }
  };

  // Make the query
  const productsRes = useProducts(
    currFolderId,
    {
      onError: onProductsError,
    },
    {
      enabled: false,  // Disable query by default so it should be fecthed using productsRes.refetch()
      staleTime: defaultFreshTime,  // Default stale time (time between periodic refetching the data) is 3 hours
      cacheTime: defaultFreshTime,
    },
  );

  // Select a folder to be the current folder, setting it to 0 is selecting no folder
  const getProductsInFolder = (folderId : number) => {
    setCurrFolderId(folderId);
    return productsRes;
  };

  // Extra trick to make sure the products in a folder are only refetched when currFolderId is non-zero. This is needed
  // because we first need a re-render of this component with the new currFolderId before react-query uses the updated
  // currFolderId value.
  React.useEffect(() => {
    if (currFolderId !== 0) {
      productsRes.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currFolderId]);

  return (
    <APIContext.Provider value={{
      folderRes: folderRes,
      getProductsInFolder: getProductsInFolder,
    }}>
      {props.children}
    </APIContext.Provider>
  );
};

// Exports
export default APIContext;
export { APIContextProvider, useAPI };
export type { APIContextType };