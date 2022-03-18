import { useQuery } from "react-query";
import { UseQueryOptions } from "react-query/types/react/types";
import { getMemberByUsername, LocalAPIError, MemberType, ping, PingType } from "./localAPI";

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
type MemberByUsernameQueryCallbacks = {
  /**
   * Called on query success
   * @param {string} username Username for which the query was called
   * @param {MemberType} data Queried data
   */
  onSuccess? : (username : string, data : MemberType) => void,

  /**
   * Called on query failure
   * @param {string} username Username for which the query was called
   * @param {LocalAPIError} error Returned error object
   */
  onError? : (username : string, error : LocalAPIError) => void,
}


/**
 * Custom hook to request a member by username from the local API. Sets a TimedAlert when the response is an error.
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
      callbacks.onError(username, err);
    }
  };

  // Function to pass to the useQuery hook which calls the argument onError function if it is given
  const onQuerySuccess = (data : MemberType) => {
    if (callbacks?.onSuccess) {
      callbacks.onSuccess(username, data);
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
