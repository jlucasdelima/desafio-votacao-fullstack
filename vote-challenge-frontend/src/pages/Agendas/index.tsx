import { Button, Collapse, Divider, Drawer, Empty, Flex, Form, Input, InputNumber, Modal, Progress, Space, Spin, Tabs, TabsProps, Tag, Tooltip, Typography } from "antd";
import { useUser } from "../../providers/UserProvider";
import { useEffect, useState } from "react";
import { CreateAgendaData, FinishedAgenda, getFinishedAgendas, getPendingAgendas, openAgenda, OpenAgendaData, PendingAgenda, registerAgenda } from "../../services/agenda.service";
import { useNavigate } from "react-router-dom";
import { vote } from "../../services/vote.service";
import Title from "antd/es/typography/Title";
import { PlusOutlined } from "@ant-design/icons";
import './index.css';
import { useForm } from "antd/es/form/Form";

interface PendingAgendaItem {
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

const pendingAgendaItem = (
  agenda: PendingAgenda,
  key: number,
  handleVoteSubmit: (voteSubmitProps: VoteSubmitProps) => void,
  handleOpenAgenda: (agenda: PendingAgenda) => void
): PendingAgendaItem => {
  return {
    key: `${key}`,
    label: agenda.title,
    children:
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
          )
        ) : (
          <Button
            onClick={() =>
              handleOpenAgenda(agenda)}
          >
            Abrir Votação
          </Button>
        )}
      </>,
    extra: agenda.isOpen
      ? <Tag color="#87d068">Votação Aberta</Tag>
      : undefined
  } as PendingAgendaItem;
};

const finishedAgendaItem = (agenda: FinishedAgenda, key: number): FinishedAgendaItem => {
  const approved = agenda.approvalRatio > .5;
  return {
    key: `${key}`,
    label: agenda.title,
    children: <>
      <p className="agenda-description">{agenda.description}</p>
      <Divider>Aprovação</Divider>
      <Flex gap=".5rem" align="center">
        <Tooltip title={`Total de votos: ${agenda.totalVotes}`}>
          <Progress
            percent={parseFloat((agenda.approvalRatio * 100).toFixed(2))}
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
  } as FinishedAgendaItem;
};

enum TabsEnum {
  pending = 'pending',
  finished = 'finished'
}

function Agendas() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [newAgendaForm] = useForm();
  const [openAgendaForm] = useForm();
  const [pendingAgendas, setPendingAgendas] = useState<PendingAgenda[]>([]);
  const [finishedAgendas, setFinishedAgendas] = useState<FinishedAgenda[]>([]);
  const [pautaDrawerOpen, setPautaDrawerOpen] = useState(false);
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
          agenda.id === values.agendaId ? {
            ...agenda,
            isOpen: true
          } : agenda
        );
        setPendingAgendas(updatedPendingAgendas);
        setAgendaModalOpen(false);
        openAgendaForm.resetFields();
      })
      .finally(() => setSpinning(false));
  };

  const handleVoteSubmit = ({ approve, agendaId }: VoteSubmitProps) => {
    setSpinning(true);
    vote({
      userId: user?.id || -1,
      agendaId,
      approve
    }).then(() => {
      const updatedPendingAgendas = pendingAgendas.map((agenda) =>
        agenda.id === agendaId ? {
          ...agenda,
          isVoted: true
        } : agenda
      );
      setPendingAgendas(updatedPendingAgendas);
    })
    .finally(() => setSpinning(false));
  };

  const showPautaDrawer = () => {
    setPautaDrawerOpen(true);
  };

  const handlePautaDrawerClose = () => {
    setPautaDrawerOpen(false);
  };

  const handleSubmitAgenda = (values: CreateAgendaData) => {
    const data: CreateAgendaData = {
      ...values,
      userCreatorId: user?.id || -1
    }
    registerAgenda(data)
      .then(() => {
        updatePendingAgendas();
        handlePautaDrawerClose();
        newAgendaForm.resetFields();
      });
  };

  const tabItems: TabsProps['items'] = [
    {
      key: TabsEnum.pending,
      label: 'Pendentes',
      children: pendingAgendas.length ? (
        <Flex gap=".5rem" vertical>
          {pendingAgendas.map((agenda, idx) =>
            <Collapse
              key={idx}
              items={[pendingAgendaItem(agenda, 0, handleVoteSubmit, handleOpenAgenda)]}
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
      key: TabsEnum.finished,
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
          onClick={showPautaDrawer}
          icon={<PlusOutlined />}
          style={{visibility: activeTab === TabsEnum.pending
            ? 'visible' : 'hidden'}}
        >
          Criar pauta
        </Button>
      </Flex>
      <Tabs defaultActiveKey={activeTab} items={tabItems} onChange={handleChangeTab} />
      <Drawer
        title="Criar nova pauta"
        width={720}
        onClose={handlePautaDrawerClose}
        open={pautaDrawerOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={handlePautaDrawerClose}>Cancelar</Button>
            <Button form="pauta-form" type="primary" htmlType="submit">
              Concluir
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          id="pauta-form"
          onFinish={handleSubmitAgenda}
          form={newAgendaForm}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Insira o título da pauta' }]}
          >
            <Input placeholder="Título da pauta" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[{ required: true, message: 'Insira a descrição da pauta' }]}
          >
            <Input.TextArea
              placeholder="Descrição da pauta"
              autoSize={{ minRows: 5, maxRows: 15 }}
            />
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Abrir votação"
        open={agendaModalOpen}
        okText="Confirmar"
        cancelText="Cancelar"
        onOk={handleConfirmAgendaModal}
        onCancel={handleCloseAgendaModal}
      >
        <Form
          id="pauta-form"
          onFinish={handleSubmitOpenAgenda}
          form={openAgendaForm}
          initialValues={{
            agendaId: -1,
            sessionDuration: 1,
          }}
        >
          <Form.Item
            name="agendaId"
            style={{ display: 'none' }}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="sessionDuration"
            label="Duração da votação"
            rules={[
              {required: true, message: "Informe a duração da sessão"}
            ]}
          >
            <InputNumber min={1} addonAfter="Minuto(s)"/>
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={spinning} fullscreen />
    </>
  )
}

export default Agendas
