import { SaleInvoiceType, SaleType } from "../../api/localAPI";
import { AlertStateType } from "./AlertContext";

/**
 * Displays a message if a user is not found
 * @param {string} username Username which is not found
 * @param {string | undefined} rawError Raw error message
 */
export const usernameNotFoundAlert = (username : string, rawError? : string) : AlertStateType => {
  return {
    display: {
      heading: `${username} niet gevonden`,
      message: `Probeer het nog een keer. ${rawError}`,
      variant: "warning",
    },
    timeout: 10000,  // 10 seconds
  };
};

/**
 * Displays a message if a request is timed out
 * @param {string | undefined} rawError Raw error message
 */
export const timeoutAlert = (rawError? : string) : AlertStateType => {
  return {
    display: {
      heading: "Timeout",
      message: `Het duurde te lang voor er een reactie van Congressus kwam. Probeer het later nog een keer. ${rawError}`,
      variant: "danger",
    },
    timeout: 10000,  // 10 seconds
  };
};

/**
 * Display a validation error for sale posts.
 * @param {string} rawError Raw error message
 */
export const validationErrorAlert = (rawError : string) : AlertStateType => {
  return {
    display: {
      heading: `Validatie error`,
      message: `Dit komt door een fout in de app, waarschijnlijk bestaat de gebruiker of één van de producten in deze verkoop niet. Probeer het nog een keer. ${rawError}`,
      variant: "danger",
    },
    timeout: 300000,  // Default to 5 minutes
  };
};

/**
 * Displays a message if a sale is successful
 */
export const saleSuccessfulAlert = () : AlertStateType => {
  return {
    display: {
      heading: `Gelukt!`,
      message: `Je producten zijn afgerekend.`,
      variant: "success",
    },
    timeout: 10000,  // 10 seconds
  };
};

/**
 * Display an unknown error.
 * @param {string} rawError Raw error message
 */
export const unknownErrorAlert = (rawError : string) : AlertStateType => {
  return {
    display: {
      heading: `Onbekende error`,
      message: `Probeer het nog een keer. ${rawError}`,
      variant: "danger",
    },
    timeout: 300000,  // Default to 5 minutes
  };
};