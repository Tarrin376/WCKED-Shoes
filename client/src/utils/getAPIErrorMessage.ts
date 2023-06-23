import { AxiosError } from "axios";
import { TErrorMessage } from "../@types/TErrorMessage";

export const getAPIErrorMessage = (errorObj: AxiosError<{ error: string }>): TErrorMessage => {
  if (!errorObj.response) {
    return { message: "Something went wrong. Try again later.", status: 500 };
  } else if (errorObj.response.status === 429) {
    return { message: "Error, too many requests made. Try again later.", status: 429 };
  } else {
    return {message: errorObj.response.data.error, status: errorObj.response.status };
  }
}