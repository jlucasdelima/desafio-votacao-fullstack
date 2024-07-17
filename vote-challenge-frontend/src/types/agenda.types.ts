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