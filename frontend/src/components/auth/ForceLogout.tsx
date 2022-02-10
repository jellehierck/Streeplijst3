import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";

type ForceLogoutProps = {}

// Forces logout when the wrapped children are mounted
const ForceLogout : React.FC<ForceLogoutProps> = (props) => {
  const auth = useAuth();

  // If a user is logged in, log them out. useEffect is used to make sure this only triggers when the ForceLogout
  // component is loaded again
  useEffect(() => {
    if (auth.user) {
      auth.logout(() => {
      });
    }
  }, []);

  return <>
    {props.children}
  </>
}


// Exports
export default ForceLogout;