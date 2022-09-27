import axios, { AxiosRequestConfig } from "axios";

import { LOCAL_HOST, LocalAPIError } from "../api/localAPI";

export type LastConnectedCardType = {
  card_uid : string,
  currently_connected : boolean,
  connected : string,
}

const NFC_ENDPOINT = "nfc";

//HTTP request object, an instance of Axios with initial configuration
const HTTP = axios.create({
  baseURL: `${LOCAL_HOST}/${NFC_ENDPOINT}`,
});

/**
 * Generic request to the NFC API.
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

export const getLastConnectedCard = (seconds : number | null) : Promise<LastConnectedCardType | null> => {
  return request<LastConnectedCardType>({url: "/last-connected-card"})
    .then(card => card)
    .catch(err => err);
};
