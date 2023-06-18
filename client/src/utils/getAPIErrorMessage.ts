import { AxiosError } from "axios";
import { TErrorMessage } from "../@types/TErrorMessage";

export const getAPIErrorMessage = (error: AxiosError): TErrorMessage => {
  if (error.response!.status === 429) {
    return { message: "Error, too many requests made. Try again later.", status: 429 };
  } else {
    return {message: error.response!.data as string, status: error.response!.status };
  }
}