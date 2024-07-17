import { AxiosResponse } from 'axios';
import api from '../config/api';
import { VoteIntent } from '../types/vote.types';

export const vote = async (vote: VoteIntent): Promise<AxiosResponse> =>
  await api.post('/vote', vote);