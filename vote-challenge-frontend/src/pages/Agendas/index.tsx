import { Button, Collapse, Divider, Empty, Flex, Progress, Spin, Tabs, TabsProps, Tag, Tooltip, Typography } from "antd";
import { useUser } from "../../providers/UserProvider";
import { useEffect, useState } from "react";
import { FinishedAgenda, getFinishedAgendas, getOpenAgendas, OpenAgenda } from "../../services/agenda.service";
import { useNavigate } from "react-router-dom";
import { vote } from "../../services/vote.service";
import Title from "antd/es/typography/Title";

interface OpenAgendaItem {
  key: string,
  label: string,
  children: JSX.Element,
  extra: JSX.Element | undefined,
}

interface FinishedAgendaItem {
  key: string,
  label: string,
  children: JSX.Element,
  extra: JSX.Element | undefined,
}

interface VoteSubmitProps {
  approve: boolean,
  agendaId: number,
}

const openAgendaItem = (agenda: OpenAgenda, key: number, handleVoteSubmit: (voteSubmitProps: VoteSubmitProps) => void): OpenAgendaItem => {
  return {
    key: `${key}`,
    label: agenda.title,
    children: <>
      <p>{agenda.description}</p>
      {agenda.active && !agenda.voted && (
        <>
          <Divider />
          <Flex gap=".5rem">
            <Button
              onClick={() =>
                handleVoteSubmit({ approve: true, agendaId: agenda.id })}
            >
                Sim
            </Button>
            <Button
              onClick={() =>
                handleVoteSubmit({ approve: false, agendaId: agenda.id })}
              danger
            >
                Não
            </Button>
          </Flex>
        </>
      )}
      {agenda.voted && (
        <>
          <Divider />
          <Typography.Text italic type="secondary">
            Voto já contabilizado
          </Typography.Text>
        </>
      )}
    </>,
    extra: agenda.active
      ? <Tag color="#87d068">Votação Aberta</Tag>
      : <span>Inicia às {agenda.startTimestamp}</span>
  } as OpenAgendaItem;
};

const finishedAgendaItem = (agenda: FinishedAgenda, key: number): FinishedAgendaItem => {
  const approved = agenda.approvalRatio > .5;
  return {
    key: `${key}`,
    label: agenda.title,
    children: <>
      <p>{agenda.description}</p>
      <Divider>Aprovação</Divider>
      <Flex gap=".5rem" align="center">
        <Tooltip title={`Total de votos: ${agenda.totalVotes}`}>
          <Progress
            percent={agenda.approvalRatio * 100}
            percentPosition={{ align: 'center', type: 'outer' }}
            strokeColor={approved
              ? '#87d068' : '#f50'}
          />
        </Tooltip>
      </Flex>
    </>,
    extra: approved
      ? <Tag color="#87d068">Aprovada</Tag>
      : <Tag color="#f50">Negada</Tag>
  } as OpenAgendaItem;
};

function Agendas() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [openAgendas, setOpenAgendas] = useState<OpenAgenda[]>([]);
  const [finishedAgendas, setFinishedAgendas] = useState<FinishedAgenda[]>([]);
  const [spinning, setSpinning] = useState(false);

  const handleVoteSubmit = ({ approve, agendaId }: VoteSubmitProps) => {
    setSpinning(true);
    vote({
      userId: user?.id || -1,
      agendaId,
      approve
    }).then(() => {
      const updatedOpenAgendas = openAgendas.map((agenda) =>
        agenda.id === agendaId ? {
          ...agenda,
          voted: true
        } : agenda
      );
      setOpenAgendas(updatedOpenAgendas);
    })
    .finally(() => setSpinning(false));
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'open',
      label: 'Abertas',
      children: openAgendas ? (
        <Flex gap=".5rem" vertical>
          {openAgendas.map((agenda, idx) =>
            <Collapse
              key={idx}
              items={[openAgendaItem(agenda, 0, handleVoteSubmit)]}
            />
          )}
        </Flex>
      ) : (
        <Empty
          description={
            <Typography.Text>
              Sem pautas
            </Typography.Text>
          }
        />
      ),
    },
    {
      key: 'finished',
      label: 'Encerradas',
      children: finishedAgendas.length ? (
        <Flex gap=".5rem" vertical>
          {finishedAgendas.map((agenda, idx) =>
            <Collapse key={idx} items={[finishedAgendaItem(agenda, 0)]} />)}
        </Flex>
      ) : (
        <Empty
          description={
            <Typography.Text>
              Sem pautas
            </Typography.Text>
          }
        />
      ),
    },
  ];

  const updateOpenAgendas = () => {
    setSpinning(true);
    getOpenAgendas(user?.id || -1)
      .then((agendas) => {
        const ordenated = agendas.sort((a, b) => +b.active - +a.active);
        setOpenAgendas(ordenated);
      })
      .finally(() => setSpinning(false));
  };

  const handleChangeTab = (activeKey: string) => {
    if (activeKey === 'open') {
      updateOpenAgendas();
      return;
    }

    setSpinning(true);
    getFinishedAgendas()
      .then((agendas) => {
        setFinishedAgendas(agendas);
      })
      .finally(() => setSpinning(false));
  };

  useEffect(() => {
    if (!user) {
      navigate('/home');
      return;
    }
    updateOpenAgendas();
  }, []);

  return (
    <>
      <Title level={2}>Painel de Pautas</Title>
      <Tabs defaultActiveKey="open" items={tabItems} onChange={handleChangeTab} />
      <Spin spinning={spinning} fullscreen />
    </>
  )
}

export default Agendas
