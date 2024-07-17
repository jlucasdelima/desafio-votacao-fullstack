import { Divider, Progress, Tooltip } from "antd";
import Flex from "antd/es/flex";
import { FinishedAgenda } from "../../types/agenda.types";

interface FinishedAgendaItemProps {
  agenda: FinishedAgenda;
  approved: boolean;
}

const FinishedAgendaItem = ({ agenda, approved }: FinishedAgendaItemProps) => {
  return (
    <>
      <p className="agenda-description">{agenda.description}</p>
      <Divider>Aprovação</Divider>
      <Flex gap=".5rem" align="center">
        <Tooltip title={`Total de votos: ${agenda.totalVotes}`}>
          <Progress
            percent={parseFloat((agenda.approvalRatio * 100).toFixed(2))}
            percentPosition={{ align: "center", type: "outer" }}
            strokeColor={approved ? "#87d068" : "#f50"}
          />
        </Tooltip>
      </Flex>
    </>
  );
};

export default FinishedAgendaItem;
