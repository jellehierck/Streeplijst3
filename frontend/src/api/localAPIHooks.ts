import { useMutation, useQuery } from "react-query";
import { UseMutationOptions, UseQueryOptions } from "react-query/types/react/types";
import {
  FolderType,
  getFolders,
  getMemberByUsername,
  getProducts,
  LocalAPIError,
  MemberType,
  ping,
  PingType,
  postSale,
  ProductType,
  SaleInvoiceType,
  SalePostType,
  getSalesByUsername, SaleInvoiceFilterType,
} from "./localAPI";

// Default configuration for React Query useQuery hook
export const defaultQueryConfig = {
  retry: false,  // Disable retries as they are handled at the local API already
};

/**
 * Custom hook to request a ping from the local API.
 */
export const usePing = () => {
  return useQuery<PingType, LocalAPIError>("ping", ping, defaultQueryConfig);
};

// Callbacks to call upon successful or failed query for a member by username API call
export type MemberByUsernameQueryCallbacks = {
  /**
   * Called on query success
   * @param {MemberType} responseData Queried member data
   * @param {string} username Username for which the query was called
   */
  onSuccess? : (responseData : MemberType, username : string) => void,

  /**
   * Called on query failure
   * @param {LocalAPIError} error Returned error object
   * @param {string} username Username for which the query was called
   */
  onError? : (error : LocalAPIError, username : string) => void,
}


/**
 * Custom hook to request a member by username from the local API.
 * @param username Username to find the member for
 * @param callbacks Callbacks to call on query success or failure
 * @param options Optional extra options to pass to the query
 */
export const useMemberByUsername = (
  username : string,
  callbacks? : MemberByUsernameQueryCallbacks,
  options? : Omit<UseQueryOptions<MemberType, LocalAPIError>, "queryKey" | "queryFn">,
) => {
  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQueryError = (err : LocalAPIError) => {
    if (callbacks?.onError) {
      callbacks.onError(err, username);
    }
  };

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQuerySuccess = (data : MemberType) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(data, username);
    }
  };

  // Set options by taking the default and overriding if needed
  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    onError: onQueryError,  // Pass functions to be called on query error or success
    onSuccess: onQuerySuccess,
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };

  return useQuery<MemberType, LocalAPIError>(["members", {username: username}], () => getMemberByUsername(username), options);
};

// Callbacks to call upon successful or failed query for all folders from the Congressus API
export type FoldersQueryCallback = {
  /**
   * Called on query success
   * @param {FolderType[]} responseData Queried folders
   */
  onSuccess? : (responseData : FolderType[]) => void,

  /**
   * Called on query failure
   * @param {LocalAPIError} error Returned error object
   */
  onError? : (error : LocalAPIError) => void,
}


/**
 * Custom hook to request all folders from the local API.
 * @param callbacks Callbacks to call on query success or failure
 * @param options Optional extra options to pass to the query
 */
export const useFolders = (
  callbacks? : FoldersQueryCallback,
  options? : Omit<UseQueryOptions<FolderType[], LocalAPIError>, "queryKey" | "queryFn">,
) => {
  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQueryError = (err : LocalAPIError) => {
    if (callbacks?.onError) {
      callbacks.onError(err);
    }
  };

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQuerySuccess = (data : FolderType[]) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(data);
    }
  };

  // Set options by taking the default and overriding if needed
  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    onError: onQueryError,  // Pass functions to be called on query error or success
    onSuccess: onQuerySuccess,
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };

  return useQuery<FolderType[], LocalAPIError>(["folders"], () => getFolders(), options);
};

// Callbacks to call upon successful or failed query for all folders from the Congressus API
export type ProductsQueryCallback = {
  /**
   * Called on query success
   * @param responseData Queried folders
   * @param folderId Folder ID for which products were requested
   */
  onSuccess? : (responseData : ProductType[], folderId : number) => void,

  /**
   * Called on query failure
   * @param error Returned error object
   * @param folder Folder ID for which products were requested
   */
  onError? : (error : LocalAPIError, folderId : number) => void,
}


/**
 * Custom hook to request all folders from the local API.
 * @param folderId Folder ID to get products for
 * @param callbacks Callbacks to call on query success or failure
 * @param options Optional extra options to pass to the query
 */
export const useProducts = (
  folderId : number,
  callbacks? : ProductsQueryCallback,
  options? : Omit<UseQueryOptions<ProductType[], LocalAPIError>, "queryKey" | "queryFn">,
) => {
  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQueryError = (err : LocalAPIError) => {
    if (callbacks?.onError) {
      callbacks.onError(err, folderId);
    }
  };

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQuerySuccess = (data : ProductType[]) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(data, folderId);
    }
  };

  // Set options by taking the default and overriding if needed
  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    onError: onQueryError,  // Pass functions to be called on query error or success
    onSuccess: onQuerySuccess,
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };

  return useQuery<ProductType[], LocalAPIError>(["products", {folder: folderId}], () => getProducts(folderId), options);
};

export type SalePostQueryCallbacks = {
  /**
   * Called on post success
   * @param {SaleInvoiceType} responseData Server response
   * @param {SalePostType} sale Sale which was posted
   */
  onSuccess? : (responseData : SaleInvoiceType, sale : SalePostType) => void,

  /**
   * Called on post failure
   * @param {LocalAPIError} error Returned error object
   * @param {SalePostType} sale Sale which was attempted to post
   */
  onError? : (error : LocalAPIError, sale : SalePostType) => void,
}

/**
 * Post a sale to the congressus API, returns a Mutation object with which a sale can actually be posted using the
 * .mutate(sale) method.
 * @param callbacks Callbacks to call on query success or failure
 * @param options Optional extra options to pass to the query
 */
export const usePostSale = (
  callbacks? : SalePostQueryCallbacks,
  options? : Omit<UseMutationOptions<SaleInvoiceType, LocalAPIError, SalePostType>, "mutationKey" | "mutationFn">,
) => {

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQueryError = (err : LocalAPIError, sale : SalePostType) => {
    if (callbacks?.onError) {
      callbacks.onError(err, sale);
    }
  };

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQuerySuccess = (data : SaleInvoiceType, sale : SalePostType) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(data, sale);
    }
  };

  // Set options by taking the default and overriding if needed
  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    onError: onQueryError,  // Pass functions to be called on query error or success
    onSuccess: onQuerySuccess,
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };

  return useMutation<SaleInvoiceType, LocalAPIError, SalePostType>(postSale, options);
};

// Callbacks to call upon successful or failed query for all folders from the Congressus API
export type SaleInvoiceQueryCallbacks = {
  /**
   * Called on query success
   * @param {SaleInvoiceType[]} responseData Queried sale invoice data
   * @param {string} username Username for which the query was called
   */
  onSuccess? : (responseData : SaleInvoiceType[], username : string) => void,

  /**
   * Called on query failure
   * @param {LocalAPIError} error Returned error object
   * @param {string} username Username for which the query was called
   */
  onError? : (error : LocalAPIError, username : string) => void,
}

/**
 * Get sales posted by a user in the past, optionally filtered
 * @param {string} username The user to retrieve sales for
 * @param {SaleInvoiceFilterType} filters Optional sale invoice filters to pass to the query
 * @param callbacks Callbacks to call on query success or failure
 * @param options Optional extra options to pass to the query
 */
export const useSalesByUsername = (
  username : string,
  filters? : SaleInvoiceFilterType,
  callbacks? : SaleInvoiceQueryCallbacks,
  options? : Omit<UseQueryOptions<SaleInvoiceType[], LocalAPIError>, "queryKey" | "queryFn">,
) => {
  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQueryError = (err : LocalAPIError) => {
    if (callbacks?.onError) {
      callbacks.onError(err, username);
    }
  };

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQuerySuccess = (data : SaleInvoiceType[]) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(data, username);
    }
  };

  // Set options by taking the default and overriding if needed
  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    onError: onQueryError,  // Pass functions to be called on query error or success
    onSuccess: onQuerySuccess,
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };

  return useQuery<SaleInvoiceType[], LocalAPIError>(
    ["sales", {username: username}],
    () => getSalesByUsername(username, filters), options,
  );
};