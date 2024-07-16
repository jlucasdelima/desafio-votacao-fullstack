interface voteIntent {
  userId: number,
  agendaId: number,
  approve: boolean,
} 

export const vote = async (vote: voteIntent): Promise<Response> => {

  const response = await fetch('http://localhost:8080/api/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vote),
  });

  return response;
};