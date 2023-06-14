import { AxiosError } from "axios";

export const getAPIErrorMessage = (error: AxiosError): {
  message: string,
  status: number
} => {
  if (error.response!.status === 429) {
    return { message: "Error, too many requests made. Try again later.", status: 429 };
  } else {
    console.log(error);
    return {message: error.response!.data as string, status: error.response!.status };
  }
}