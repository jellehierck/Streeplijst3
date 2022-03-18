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

/**
 * Custom hook to request a member by username from the local API. Sets a TimedAlert when the response is an error.
 * @param {string} username Username to find the member for
 * @param options Optional extra options to pass to the query
 */
export const useMemberByUsername = (username : string, options? : Omit<UseQueryOptions<MemberType, LocalAPIError>, "queryKey" | "queryFn">) => {


  // Set options by taking the default and overriding if needed
  options = {
    ...defaultQueryConfig,  // First apply the default configuration
    ...options,  // Add additional options specified in the function arguments, overriding the defaults if needed
  };

  return useQuery<MemberType, LocalAPIError>(["members", {username: username}], () => getMemberByUsername(username), options);
};
