import { AlertStateType } from "./AlertContext";

/**
 * Displays a message if a user is not found
 * @param {string} username Username which is not found
 * @param {string | undefined} rawError Raw error message
 * @returns {AlertStateType}
 */
const usernameNotFoundAlert = (username : string, rawError? : string) : AlertStateType => {
  return {
    display: {
      heading: `${username} niet gevonden`,
      message: `Probeer het nog een keer. ${rawError}`,
      variant: "warning",
    },
    timeout: 10000,  // 10 seconds
  };
};

export { usernameNotFoundAlert };