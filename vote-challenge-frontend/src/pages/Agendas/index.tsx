import { Button, Collapse, Empty, Flex, Spin, Tabs, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useUser } from "../../providers/UserProvider";
import { getFinishedAgendas, getPendingAgendas, openAgenda, registerAgenda } from "../../services/agenda.service";
import { vote } from "../../services/vote.service";
import PendingAgendaItem, { VoteSubmitProps } from "../../components/pendingAgendaItem";
import FinishedAgendaItem from "../../components/finishedAgendaItem";
import AgendaForm from "../../components/agendaForm";
import AgendaModal from "../../components/agendaModal";
import './index.css';
import { CreateAgendaData, FinishedAgenda, OpenAgendaData, PendingAgenda } from "../../types/agenda.types";

enum TabsEnum {
  pending = 'pending',
  finished = 'finished'
}

function Agendas() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [openAgendaForm] = useForm();
  const [newAgendaForm] = useForm();
  const [pendingAgendas, setPendingAgendas] = useState<PendingAgenda[]>([]);
  const [finishedAgendas, setFinishedAgendas] = useState<FinishedAgenda[]>([]);
  const [agendaDrawerOpen, setAgendaDrawerOpen] = useState(false);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(TabsEnum.pending);
  const [spinning, setSpinning] = useState(false);

  const handleOpenAgenda = (agenda: PendingAgenda) => {
    setAgendaModalOpen(true);
    openAgendaForm.setFieldValue('agendaId', agenda.id);
  };

  const handleCloseAgendaModal = () => {
    setAgendaModalOpen(false);
    openAgendaForm.resetFields();
  };

  const handleConfirmAgendaModal = () => openAgendaForm.submit();

  const handleSubmitOpenAgenda = (values: OpenAgendaData) => {
    setSpinning(true);
    openAgenda(values)
      .then(() => {
        const updatedPendingAgendas = pendingAgendas.map((agenda) =>
          agenda.id === values.agendaId ? { ...agenda, isOpen: true } : agenda
        );
        setPendingAgendas(updatedPendingAgendas);
        setAgendaModalOpen(false);
        openAgendaForm.resetFields();
      })
      .finally(() => setSpinning(false));
  };

  const handleVoteSubmit = ({ approve, agendaId }: VoteSubmitProps) => {
    setSpinning(true);
    vote({ userId: user?.id || -1, agendaId, approve })
      .then(() => {
        const updatedPendingAgendas = pendingAgendas.map((agenda) =>
          agenda.id === agendaId ? { ...agenda, isVoted: true } : agenda
        );
        setPendingAgendas(updatedPendingAgendas);
      })
      .finally(() => setSpinning(false));
  };

  const showAgendaDrawer = () => {
    setAgendaDrawerOpen(true);
  };

  const handleAgendaDrawerClose = () => {
    setAgendaDrawerOpen(false);
  };

  const handleSubmitAgenda = (values: CreateAgendaData) => {
    const data: CreateAgendaData = { ...values, userCreatorId: user?.id || -1 };
    registerAgenda(data)
      .then(() => {
        updatePendingAgendas();
        handleAgendaDrawerClose();
        newAgendaForm.resetFields();
      });
  };

  const tabItems = [
    {
      key: TabsEnum.pending,
      label: 'Pendentes',
      children: pendingAgendas.length ? (
        <Flex gap=".5rem" vertical>
          {pendingAgendas.map((agenda, idx) =>
            <Collapse
              key={idx}
              items={[{
                key: `${idx}`,
                label: agenda.title,
                children: <PendingAgendaItem
                  agenda={agenda}
                  handleVoteSubmit={handleVoteSubmit}
                  handleOpenAgenda={handleOpenAgenda}
                />,
                extra: agenda.isOpen && (
                  <Tag color="#87d068">Votação Aberta</Tag>
                ),
              }]}
            />
          )}
        </Flex>
      ) : (
        <Empty description={<Typography.Text>Sem pautas</Typography.Text>} />
      ),
    },
    {
      key: TabsEnum.finished,
      label: 'Encerradas',
      children: finishedAgendas.length ? (
        <Flex gap=".5rem" vertical>
          {finishedAgendas.map((agenda, idx) =>
            <Collapse
              key={idx}
              items={[{
                key: `${idx}`,
                label: agenda.title,
                children: <FinishedAgendaItem
                  approved={agenda.approvalRatio > 0.5}
                  agenda={ agenda }
                />,
                extra: agenda.approvalRatio > 0.5
                  ? <Tag color="#87d068">Aprovada</Tag>
                  : <Tag color="#f50">Negada</Tag>
              }]}
            />
          )}
        </Flex>
      ) : (
        <Empty description={<Typography.Text>Sem pautas</Typography.Text>} />
      ),
    },
  ];

  const updatePendingAgendas = () => {
    setSpinning(true);
    getPendingAgendas(user?.id || -1)
      .then((agendas) => {
        const ordenated = agendas.sort((a, b) => +b.isOpen - +a.isOpen);
        setPendingAgendas(ordenated);
      })
      .finally(() => setSpinning(false));
  };

  const handleChangeTab = (activeKey: string) => {
    setActiveTab(activeKey);
  };

  useEffect(() => {
    if (!user) {
      navigate('/home');
      return;
    }
    updatePendingAgendas();
  }, []);

  useEffect(() => {
    if (activeTab === TabsEnum.pending) {
      updatePendingAgendas();
      return;
    }
    setSpinning(true);
    getFinishedAgendas()
      .then((agendas) => {
        setFinishedAgendas(agendas);
      })
      .finally(() => setSpinning(false));
  }, [activeTab]);

  return (
    <>
      <Flex justify="space-between" align="end">
        <Title level={2} style={{ margin: 0 }}>Painel de Pautas</Title>
        <Button
          type="primary"
          onClick={showAgendaDrawer}
          icon={<PlusOutlined />}
          style={{ visibility: activeTab === TabsEnum.pending ? 'visible' : 'hidden' }}
        >
          Criar pauta
        </Button>
      </Flex>
      <Tabs defaultActiveKey={activeTab} items={tabItems} onChange={handleChangeTab} />
      <AgendaForm form={newAgendaForm} agendaDrawerOpen={agendaDrawerOpen} handleAgendaDrawerClose={handleAgendaDrawerClose} handleSubmitAgenda={handleSubmitAgenda} />
      <AgendaModal form={openAgendaForm} agendaModalOpen={agendaModalOpen} handleConfirmAgendaModal={handleConfirmAgendaModal} handleCloseAgendaModal={handleCloseAgendaModal} handleSubmitOpenAgenda={handleSubmitOpenAgenda} />
      <Spin spinning={spinning} fullscreen />
    </>
  );
}

export default Agendas;
