import { AxiosResponse } from 'axios';
import api from '../config/api';
import { CreateAgendaData, FinishedAgenda, OpenAgendaData, PendingAgenda } from '../types/agenda.types';

export const registerAgenda = async (createAgendaData: CreateAgendaData): Promise<AxiosResponse> =>
  await api.post('/agenda', createAgendaData);

export const openAgenda = async (openAgendaData: OpenAgendaData): Promise<AxiosResponse> =>
  await api.put('/agenda/open', openAgendaData);

export const getPendingAgendas = async (userId: number): Promise<PendingAgenda[]> => {
  const response = await api.get('/agenda/pending', {
    headers: {
      'Application-User': `${userId}`,
    },
  });

  return response.data as PendingAgenda[];
};

export const getFinishedAgendas = async (): Promise<FinishedAgenda[]> => {
  const response = await api.get('/agenda/finished');

  return response.data as FinishedAgenda[];
};