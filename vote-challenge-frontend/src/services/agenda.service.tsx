export type OpenAgenda = {
  id: number,
  title: string,
  description: string,
  endTimestamp: string,
  startTimestamp: string,
  active: boolean,
  voted: boolean,
};

export type FinishedAgenda = {
  title: string,
  description: string,
  endTimestamp: string,
  startTimestamp: string,
  totalVotes: number,
  approvalRatio: number,
};

export const getOpenAgendas = async (userId: number): Promise<OpenAgenda[]> => {

  const response = (await fetch('http://localhost:8080/api/agenda/open', {
    method: 'GET',
    headers: {
      'Application-User': `${userId}`,
      'Content-Type': 'application/json',
    },
  }));

  return await response.json() as OpenAgenda[];
};

export const getFinishedAgendas = async (): Promise<FinishedAgenda[]> => {

  const response = (await fetch('http://localhost:8080/api/agenda/finished', {
    method: 'GET',
  }));

  return await response.json() as FinishedAgenda[];
};