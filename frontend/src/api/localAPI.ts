import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Folder information
export type FolderType = {
  id : number
  name : string
  parent_id : number
  published : boolean
  path : string
  media? : string  // TODO: Add a way to add media to the folders and configure that in some way
  children? : string[] | null  // TODO: check if this type is correct and/or necessary
  products? : ProductType[] | null  // TODO: Add a way to add products to folder automatically in API
}

// Product information
export type ProductType = {
  id : number
  product_offer_id : number
  name : string;
  description? : string | null
  published : boolean
  media? : string | null   // TODO: Remove returning empty array in Python API
  price : number
}

// Sale information
export type SaleType = {
  member_id : number
  items : SaleItemType[]
}

// Product sale data
export type  SaleItemType = {
  product_offer_id : number
  quantity : number
}

// User type
export type MemberType = {
  id : number;
  username : string
  first_name : string
  last_name : string
  prefix? : string | null
  suffix? : string | null
  date_of_birth : string
  show_almanac : boolean
  status : MemberStatusType
  profile_picture? : string
  bank_account? : null  // TODO: add bank account information if needed
}

// User status type
export type MemberStatusType = {
  archived : boolean,
  member_from : string,
  member_to : string | null,
  name : string,
  status_id : number,
}

export const LOCAL_HOST = "http://localhost:8000";  // Host URL of local API
export const API_VERSION = "streeplijst/v30";  // API version used

//HTTP request object, an instance of Axios with initial configuration
const HTTP = axios.create({
  baseURL: `${LOCAL_HOST}/${API_VERSION}`,
});

export type ErrorType = {
  message : string
  status : number
  statusText : string
}

/**
 * Generic request to the Local API.
 * @param config Configuration to pass.
 * @returns {Promise<ErrorType | T>} Promise of the requested data of type T or an error of type ErrorType.
 */
const request = <T>(config : AxiosRequestConfig) : Promise<T | ErrorType> => {
  return HTTP.request<T>(config)
    .then(res => {
      return res.data;  // There is a successful response, return it
    })

    .catch(err => {  // Some error has occurred
      // Determine the type of error
      if (err.response) {  // The error caused by response with a 4xx or 5xx status code
        return {
          message: err.message,
          status: err.response.status,
          statusText: err.response.statusText,
        };

      } else if (err.request) {  // The error is caused because no response was received from the server in time
        return {
          message: err.message,
          status: 500,
          statusText: "Unable to reach the local API server. Is it running?",
        };

      } else {  // The request was never sent so there is something wrong with the frontend app
        return {
          message: "An unknown error occurred in the frontend app.",
          status: 400,
          statusText: "An unknown error occurred in the frontend app.",
        };
      }
    });
};

// Ping information
export type PingType = {
  message : string
}

/**
 * Send a ping to the local API server.
 * @returns {Promise<AxiosResponse<PingType>>}
 */
export const ping = () : Promise<PingType | ErrorType> => {
  return request<PingType>({url: "/ping"});
};
