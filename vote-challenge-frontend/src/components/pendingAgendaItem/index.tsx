import { Button, Divider, Typography } from "antd";
import Flex from "antd/es/flex";
import { PendingAgenda } from "../../types/agenda.types";

export interface VoteSubmitProps {
  approve: boolean;
  agendaId: number;
}

interface PendingAgendaItemProps {
  agenda: PendingAgenda;
  handleVoteSubmit: (voteSubmitProps: VoteSubmitProps) => void;
  handleOpenAgenda: (agenda: PendingAgenda) => void;
}

const PendingAgendaItem = ({
  agenda,
  handleVoteSubmit,
  handleOpenAgenda
}: PendingAgendaItemProps) => (
  <>
    <p className="agenda-description">{agenda.description}</p>
    <Divider />
    {agenda.isOpen ? (
      agenda.isVoted ? (
        <Typography.Text italic type="secondary">
          Voto já contabilizado
        </Typography.Text>
      ) : (
        <Flex gap=".5rem">
          <Button
            onClick={() => handleVoteSubmit({ approve: true, agendaId: agenda.id })}
          >
            Sim
          </Button>
          <Button
            onClick={() => handleVoteSubmit({ approve: false, agendaId: agenda.id })}
            danger
          >
            Não
          </Button>
        </Flex>
      )
    ) : (
      <Button onClick={() => handleOpenAgenda(agenda)}>Abrir Votação</Button>
    )}
  </>
);

export default PendingAgendaItem;
