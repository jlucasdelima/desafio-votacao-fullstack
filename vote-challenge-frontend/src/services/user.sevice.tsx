import { LogInRequestModel } from "../models/requests/logInRequest.model";
import { LogInResponseModel } from "../models/responses/logInResponse.model";

export const logIn = async (cpf: string): Promise<LogInResponseModel> => {
  const requestBody: LogInRequestModel = { cpf };

  const response = (await fetch('http://localhost:8080/api/user/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }));

  return await response.json() as LogInResponseModel;
};