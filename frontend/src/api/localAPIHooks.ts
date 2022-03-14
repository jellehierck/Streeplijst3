import { useQuery } from "react-query";
import { UseQueryOptions } from "react-query/types/react/types";
import { useAlert } from "../components/alert/AlertContext";
import { unknownErrorAlert, usernameNotFoundAlert } from "../components/alert/standardAlerts";
import { getMemberByUsername, LocalAPIError, MemberType, ping, PingType } from "./localAPI";

// Default configuration for React Query useQuery hook
export const defaultQueryConfig = {
  retry: false,
};

/**
 * Custom hook to request a ping from the local API.
 */
export const usePing = () => {
  return useQuery<PingType, LocalAPIError>("ping", ping, defaultQueryConfig);
};

/**
 * Custom hook to request a member by username from the local API. Sets a TimedAlert when the response is an error.
 * @param {string} username Username to find the member for
 * @param options Optional extra options to pass to the query
 */
export const useMemberByUsernameAll = (username : string, options? : Omit<UseQueryOptions<MemberType, LocalAPIError>, "queryKey" | "queryFn">) => {
  const alert = useAlert();

  // Callback function to set the alert upon a failed member error
  const handleMemberError = (error : LocalAPIError) : void => {
    switch (error.status) {  // Determine the error type
      case 404:  // Username not found
        alert.set(usernameNotFoundAlert(username, error.toString()));  // Set the alert
        return;  // Stop execution
    }

    // All other checks failed, this is an unexpected error so set the alert to an unknown error
    console.log(error);
    alert.set(unknownErrorAlert(error.toString()));
  };

  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    onError: handleMemberError,  // Add the default error handler
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };
  return useQuery<MemberType, LocalAPIError>(["members", {username: username}], () => getMemberByUsername(username), options);

};
