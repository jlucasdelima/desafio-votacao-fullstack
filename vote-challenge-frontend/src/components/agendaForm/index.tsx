import { Button, Drawer, Form, FormInstance, Input, Space } from "antd";
import { useUser } from "../../providers/UserProvider";
import { CreateAgendaData } from "../../types/agenda.types";

interface AgendaFormProps {
  form: FormInstance;
  agendaDrawerOpen: boolean;
  handleAgendaDrawerClose: () => void;
  handleSubmitAgenda: (values: CreateAgendaData) => void;
}

const AgendaForm = ({
  form,
  agendaDrawerOpen,
  handleAgendaDrawerClose,
  handleSubmitAgenda
}: AgendaFormProps) => {
  const { user } = useUser();

  return (
    <Drawer
      title="Criar nova pauta"
      width={720}
      onClose={handleAgendaDrawerClose}
      open={agendaDrawerOpen}
      styles={{
        body: {
          paddingBottom: 80
        }
      }}
      extra={
        <Space>
          <Button onClick={handleAgendaDrawerClose}>Cancelar</Button>
          <Button form="agenda-form" type="primary" htmlType="submit">
            Concluir
          </Button>
        </Space>
      }
    >
      <Form
        layout="vertical"
        id="agenda-form"
        onFinish={handleSubmitAgenda}
        form={form}
        initialValues={{
          userCreatorId: user?.id || -1
        }}
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[{ required: true, message: "Insira o título da pauta" }]}
        >
          <Input placeholder="Título da pauta" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: "Insira a descrição da pauta" }]}
        >
          <Input.TextArea placeholder="Descrição da pauta" autoSize={{ minRows: 5, maxRows: 15 }} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AgendaForm;
