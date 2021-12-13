import { createContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import congresssus, { UserType } from "../api/API";

export const UserContext = createContext<UserType | any>([]);
export function UserContextProvider(props: any) {
  const sNumber = localStorage.getItem("sNumber");

  const [user, setUser] = useState<UserType | undefined | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("user useeffect is ebexj :XXX");
    if (sNumber) {
      // only if loggedIn
      congresssus.getMemberByUsername(sNumber || "").then((user) => {
        setUser(user);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Spinner animation="grow"></Spinner>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
}
