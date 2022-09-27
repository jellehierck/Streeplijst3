import axios, { AxiosRequestConfig } from "axios";

// Folder information
export type FolderType = {
  id : number
  name : string
  parent_id : number
  published : boolean
  path : string
  media? : string  // TODO: Add a way to add media to the folders and configure that in some way
  products? : ProductType[]  // TODO: Add a way to add products to folder automatically in API
}

// Product information
export type ProductType = {
  id : number
  product_offer_id : number
  name : string
  description : string | null
  published : boolean
  media : string | null   // TODO: Remove returning empty array in Python API
  price : number
}

// Sale Post information
export type SalePostType = {
  member_id : number
  items : SaleItemType[]
}

// Product sale data
export type  SaleItemType = {
  product_offer_id : number
  quantity : number
}

// Sale Invoice type, containing information about the sale after it is submitted to Congressus
export type SaleInvoiceType = {
  id : number
  member_id : number
  items : SaleInvoiceItemType[]
  price_paid : number  // If the invoice is already paid (i.e. the bank transfer took place) this is the total amount
  price_unpaid : number  // If the invoice is not paid yet, this is the amount that is to be paid
  invoice_date : string
  invoice_source : string
  invoice_type : string
  created : string
  modified : string
}

export type SaleInvoiceItemType = {
  name : string
  price : number
  product_offer_id : number
  quantity : number
  sale_invoice_id : number
}

// User type
export type MemberType = {
  id : number
  username : string
  first_name : string
  last_name : string
  prefix : string | null
  suffix : string | null
  date_of_birth : string
  show_almanac : boolean
  status : MemberStatusType
  // profile_picture? : string  // Removed from Congressus so not used anymore
}

// User status type
export type MemberStatusType = {
  archived : boolean
  member_from : string
  member_to : string | null
  name : string
  status_id : number
}

export class LocalAPIError extends Error {
  status : number;
  statusText : string;
  rawError? : any;

  constructor(message : string, status : number, statusText : string, rawError? : any) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.rawError = rawError;
  }
}

export const LOCAL_HOST = "http://localhost:8000";  // Host URL of local API
export const API_VERSION = "streeplijst/v30";  // API version used

//HTTP request object, an instance of Axios with initial configuration
const HTTP = axios.create({
  baseURL: `${LOCAL_HOST}/${API_VERSION}`,
});

// Response structure if some error occurred during a request to the API
export type ErrorType = {
  message : string
  status : number
  statusText : string
}

/**
 * Generic request to the Local API.
 * @param config Configuration to pass.
 * @returns {Promise<ErrorType>} Promise of the requested data of type T.
 */
const request = <T>(config : AxiosRequestConfig) : Promise<T> => {
  return HTTP.request<T>(config)
    .then(res => {
      return res.data;  // There is a successful response, return it
    })

    .catch(err => {  // Some error has occurred
      // Determine the type of error
      if (err.response) {  // The error caused by response with a 4xx or 5xx status code
        throw new LocalAPIError(
          err.message,
          err.response.status,
          err.response.statusText,
          err,
        );

      } else if (err.request) {  // The error is caused because no response was received from the server in time
        throw new LocalAPIError(
          err.message,
          500,
          "Unable to reach the local API server. Is it running?",
          err,
        );

      } else {  // The request was never sent so there is something wrong with the frontend app
        throw new LocalAPIError(
          "An unknown error occurred in the frontend app.",
          400,
          "An unknown error occurred in the frontend app.",
          err,
        );
      }
    });
};

// Ping information
export type PingType = {
  message : string
}

/**
 * Send a ping to the local API server.
 */
export const ping = () : Promise<PingType> => {
  return request<PingType>({url: "/ping"});
};

/**
 * Get a member by their username (SNumber)
 * @param {string} username SNumber
 */
export const getMemberByUsername = (username : string) : Promise<MemberType> => {
  return request<MemberType>({url: "/members/username/" + username});
};

/**
 * Get a member by their Congressus ID (not SNumber!)
 * @param {string} id Congressus ID
 */
export const getMemberById = (id : number) : Promise<MemberType> => {
  return request<MemberType>({url: "/members/id/" + id});
};

/**
 * Get all Streeplijst folders from the API
 */
export const getFolders = () : Promise<FolderType[]> => {
  return request<FolderType[]>({url: "/folders"});
};

/**
 * Get all items in a folder
 * @param {number} folderId
 */
export const getProducts = (folderId : number) : Promise<ProductType[]> => {
  return request<ProductType[]>({url: "/products/folder/" + folderId});
};

/**
 * Post a sale for a user.
 * @param sale Sale object to post.
 */
export const postSale = (sale : SalePostType) : Promise<SaleInvoiceType> => {
  return request<SaleInvoiceType>({
    method: "POST",
    url: "/sales",
    data: {
      member_id: sale.member_id,
      items: sale.items,
    },
  });
};

export type SaleInvoiceFilterType = {
  username? : string[]
  member_id? : number[]
  invoice_status? : string
  invoice_type? : string
  period_filter? : string
  product_offer_id? : number[]
  order? : string
}

/**
 * Get sale invoices for a user and optional additional filters.
 * @param username Username to get the user for
 * @param filters Optional filters to pass to the request
 */
export const getSalesByUsername = (username : string, filters? : SaleInvoiceFilterType) : Promise<SaleInvoiceType[]> => {
  return request<SaleInvoiceType[]>({
    url: "/sales/" + username,
    data: filters,
  });
};

/**
 * Get sale invoices based on filters.
 * @param filters Filters to pass to the request
 */
export const getSales = (filters : SaleInvoiceFilterType) : Promise<SaleInvoiceType[]> => {
  return request<SaleInvoiceType[]>({
    url: "/sales",
    data: filters,
  });
};
