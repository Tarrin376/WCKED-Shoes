import { TUser } from "../@types/TUser";
import * as React from "react";
import { useState, createContext, useEffect } from "react";
import axios from "axios";

type TDefaultUser = TUser & {
  cartChanged: boolean
}

interface IUserContext extends TDefaultUser {
  setUserData: React.Dispatch<React.SetStateAction<TDefaultUser>>,
}

export const defaultUserData: TDefaultUser = {
  email: "",
  cartChanged: false
}

export const UserContext = createContext<IUserContext | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState(defaultUserData);

  useEffect(() => {
    (async () => {
      try {
        const authResponse = await axios.get<TUser>("/users/jwt-login");
        setUserData((cur) => {
          return {
            ...cur,
            email: authResponse.data.email,
          }
        });
      }
      catch (error: any) {
        console.log(error.message);
      }
    })()
  }, [])
  
  return (
    <UserContext.Provider value={{ ...userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;