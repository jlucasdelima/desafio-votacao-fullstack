import api from '../config/api';
import { LogInRequestModel, LogInResponseModel } from '../types/logIn.types';

export const logIn = async (cpf: string): Promise<LogInResponseModel> => {
  const requestBody: LogInRequestModel = { cpf };

  const response = await api.post('/user', requestBody);

  return response.data as LogInResponseModel;
};