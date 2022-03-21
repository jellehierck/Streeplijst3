import React, { createContext, useContext, useState } from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../components/alert/AlertContext";
import {
  saleSuccessfulAlert,
  timeoutAlert,
  unknownErrorAlert,
  validationErrorAlert,
} from "../components/alert/standardAlerts";
import streeplijstRouteConfig from "../streeplijst/streeplijstRouteConfig";
import { FolderType, LocalAPIError, ProductType, SaleInvoiceType, SaleType } from "./localAPI";
import { useFolders, usePostSale, useProducts } from "./localAPIHooks";

// Default time for which queried data is considered fresh and should not be fetched again (to make the app fast), since
// data on the API changes almost never
const defaultFreshTime = 3 * 60 * 60 * 1000;  // 3 hours TODO: See what influence this has on performance/stability

// Context type to pass along
type APIContextType = {
  // All folders in the Streeplijst API
  folderRes : UseQueryResult<FolderType[], LocalAPIError>

  /**
   * Select a folder so that the products in that folder are loaded.
   * @param folderId Folder ID to get the products for
   * @returns React-query result for the products in a folder
   */
  getProductsInFolder : (folderId : number) => UseQueryResult<ProductType[], LocalAPIError>

  /**
   * Post a sale to the local API. On success or failure, an alert is set after which optional onSuccess or onError
   * functions are called.
   * @param sale Sale to post
   * @param onSuccess Function to call on mutation success, after the alert is set
   * @param onError Function to call on mutation error, after the alert is set
   * @returns the saleMutation object
   */
  postSaleToAPI(sale : SaleType, onSuccess? : VoidFunction, onError? : VoidFunction) : void

  // Sale Mutation object which has information about the mutation state
  saleMutation : UseMutationResult<SaleInvoiceType, LocalAPIError, SaleType>
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

  // Function to fire on a sale post error
  const onPostError = (error : LocalAPIError, sale : SaleType) => {
    switch (error.status) {  // Determine the error type
      case 400:  // Validation error
        alert.set(validationErrorAlert(error.toString()));  // Set the alert
        break;
      case 408:  // Request timeout
        alert.set(timeoutAlert(error.toString()));  // Set alert
        break;
      default: // All other checks failed, this is an unexpected error so set the alert to an unknown error
        console.log(error);
        alert.set(unknownErrorAlert(error.toString()));
    }
  };

  // Get the sale mutation, a react-query hook which sets up a post request but only posts after calling .mutate()
  const saleMutation = usePostSale({onError: onPostError});

  // Function which will post a sale to the API
  const postSaleToAPI = (sale : SaleType, onSuccess? : VoidFunction, onError? : VoidFunction) : void => {
    saleMutation.mutate(sale, {onError: onError, onSuccess: onSuccess});
  };

  return (
    <APIContext.Provider value={{
      folderRes: folderRes,
      getProductsInFolder: getProductsInFolder,
      postSaleToAPI: postSaleToAPI,
      saleMutation: saleMutation,
    }}>
      {props.children}
    </APIContext.Provider>
  );
};

// Exports
export default APIContext;
export { APIContextProvider, useAPI };
export type { APIContextType };