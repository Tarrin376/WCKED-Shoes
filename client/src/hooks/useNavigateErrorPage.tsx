import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import { TErrorMessage } from "../@types/TErrorMessage";

export const useNavigateErrorPage = (errorMessage: TErrorMessage | undefined) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (!userContext?.email) {
      navigate("/");
    } else if (errorMessage) {
      navigate("/error", { state: { error: errorMessage.message } });
    }

    window.scrollTo(0, 0);
  }, [errorMessage, navigate, userContext?.email])

  return navigate;
}