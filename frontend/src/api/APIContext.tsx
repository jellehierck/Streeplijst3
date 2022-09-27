import React, { createContext, useContext, useState } from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { useAlert } from "../components/alert/AlertContext";
import { timeoutAlert, unknownErrorAlert, validationErrorAlert } from "../components/alert/standardAlerts";
import { FolderType, LocalAPIError, ProductType, SaleInvoiceType, SalePostType } from "./localAPI";
import { useFolders, usePostSale, useProducts, useSalesByUsername } from "./localAPIHooks";

// Default time for which queried data is considered fresh and should not be fetched again (to make the app fast), since
// data on the API changes almost never
const defaultFreshTime = 3 * 60 * 60 * 1000;  // 3 hours TODO: See what influence this has on performance/stability

// Context type to pass along
type APIContextType = {
  // All folders in the Streeplijst API
  folderRes : UseQueryResult<FolderType[], LocalAPIError>

  /**
   * Select a folder so that the products in that folder are loaded.
   * @param {number} folderId Folder ID to get the products for
   * @returns {UseQueryResult<ProductType[], LocalAPIError>} React-query result for the products in a folder
   */
  getProductsInFolder : (folderId : number) => UseQueryResult<ProductType[], LocalAPIError>

  /**
   * Select all previous sales of a user and return a react-query response
   * @param {string} username Username to get the sales for
   * @returns {UseQueryResult<SaleInvoiceType[], LocalAPIError>}
   */
  getSalesByUsername : (username : string) => UseQueryResult<SaleInvoiceType[], LocalAPIError>

  /**
   * Post a sale to the local API. On success or failure, an alert is set after which optional onSuccess or onError
   * functions are called.
   * @param {SalePostType} sale Sale to post
   * @param {VoidFunction} onSuccess Function to call on mutation success, after the alert is set
   * @param {VoidFunction} onError Function to call on mutation error, after the alert is set
   */
  postSaleToAPI(sale : SalePostType, onSuccess? : VoidFunction, onError? : VoidFunction) : void

  // Sale Mutation object which has information about the mutation state
  saleMutation : UseMutationResult<SaleInvoiceType, LocalAPIError, SalePostType>
}

// Actual context, store of the current state
const APIContext = createContext<APIContextType>({} as APIContextType);

// Custom hook to use the APIContext
const useAPI = () : APIContextType => {
  return useContext(APIContext);
};


type APIContextProps = {
  children? : React.ReactNode
};

// React component
const APIContextProvider : React.FC<APIContextProps> = (props) => {
  const alert = useAlert();

  /* ---------------------- All folders ---------------------- */

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

  /* ---------------------- Products by folder ---------------------- */

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

  /* ---------------------- Sale Invoices by username ---------------------- */

  // Current username, used to fetch sale invoices for a specific user
  const [currUsername, setCurrUsername] = useState<string>("");

  // Callback function to set the alert upon a failed sale invoices request
  const onSalesByUsernameError = (error : LocalAPIError, username : string) : void => {
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
  const saleInvoicesRes = useSalesByUsername(
    currUsername,
    {},  // No filters applied for now (could possibly change in the future?
    {onError: onSalesByUsernameError},
    {enabled: false},
  );

  const getSalesByUsername = (username : string) => {
    setCurrUsername(username);
    return saleInvoicesRes;
  };

  // Extra trick to make sure the sale invoices of a user are only refetched when currUsername is not empty. This is
  // needed because we first need a re-render of this component with the new currUsername before react-query uses the
  // updated currUsername value.
  React.useEffect(() => {
    if (currUsername !== "") {
      saleInvoicesRes.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currUsername]);

  /* ---------------------- Post sale ---------------------- */

  // Function to fire on a sale post error
  const onPostError = (error : LocalAPIError, sale : SalePostType) => {
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
  const postSaleToAPI = (sale : SalePostType, onSuccess? : VoidFunction, onError? : VoidFunction) : void => {
    saleMutation.mutate(sale, {onError: onError, onSuccess: onSuccess});
  };

  return (
    <APIContext.Provider value={{
      folderRes: folderRes,
      getProductsInFolder: getProductsInFolder,
      getSalesByUsername: getSalesByUsername,
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
