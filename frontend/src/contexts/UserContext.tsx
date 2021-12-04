import { createContext, useState } from "react";
import { UserType } from "../api/API";

const UserContext = createContext<UserType | any>([]);
export function UserContextProvider(props: any) {
  const [user, setUser] = useState<UserType | undefined>();

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
}
