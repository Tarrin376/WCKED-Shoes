import { AxiosError } from "axios";

export const getAPIErrorMessage = (error: AxiosError): {
  message: string,
  status: number
} => {
  return { 
    message: error.response!.data as string, 
    status: error.response!.status 
  };
}