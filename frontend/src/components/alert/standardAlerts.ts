import { AlertStateType } from "./AlertContext";

/**
 * Displays a message if a user is not found
 * @param {string} username Username which is not found
 * @param {string | undefined} rawError Raw error message
 * @returns {AlertStateType}
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
 * Display an unknown error.
 * @param {string} rawError Raw error message
 * @returns {AlertStateType}
 */
export const unknownErrorAlert = (rawError : string) : AlertStateType => {
  return {
    display: {
      heading: `Unknown error`,
      message: `Probeer het nog een keer. ${rawError}`,
      variant: "danger",
    },
    timeout: 300000,  // Default to 5 minutes
  };
};