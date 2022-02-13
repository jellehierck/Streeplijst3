import { AlertStateType } from "./AlertContext";

const usernameNotFoundAlert = (username : string) : AlertStateType => {
  return {
    display: {
      heading: `${username} niet gevonden`,
      message: `Probeer het nog een keer`,
      variant: "warning",
    },
    timeout: 10000,  // 10 seconds
  };
};

export { usernameNotFoundAlert };