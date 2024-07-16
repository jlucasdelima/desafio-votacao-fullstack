export type PendingAgenda = {
  id: number,
  title: string,
  description: string,
  isOpen: boolean,
  isVoted: boolean,
};

export type FinishedAgenda = {
  title: string,
  description: string,
  totalVotes: number,
  approvalRatio: number,
};

export type CreateAgendaData = {
  title: string,
  description: string,
  userCreatorId: number
}

export type OpenAgendaData = {
  agendaId: number;
  sessionDuration: number;
};

export const registerAgenda = async (createAgendaData: CreateAgendaData): Promise<Response> => {

  const response = await fetch('http://localhost:8080/api/agenda', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createAgendaData),
  });

  return response;
};

export const openAgenda = async (openAgendaData: OpenAgendaData): Promise<Response> => {

  const response = await fetch('http://localhost:8080/api/agenda/open', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openAgendaData),
  });

  return response;
};

export const getPendingAgendas = async (userId: number): Promise<PendingAgenda[]> => {

  const response = (await fetch('http://localhost:8080/api/agenda/pending', {
    method: 'GET',
    headers: {
      'Application-User': `${userId}`,
      'Content-Type': 'application/json',
    },
  }));

  return await response.json() as PendingAgenda[];
};

export const getFinishedAgendas = async (): Promise<FinishedAgenda[]> => {

  const response = (await fetch('http://localhost:8080/api/agenda/finished', {
    method: 'GET',
  }));

  return await response.json() as FinishedAgenda[];
};