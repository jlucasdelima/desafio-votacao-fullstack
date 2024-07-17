import { Form, FormInstance, Input, InputNumber, Modal } from "antd";
import { OpenAgendaData } from "../../types/agenda.types";

interface AgendaModalProps {
  form: FormInstance;
  agendaModalOpen: boolean;
  handleConfirmAgendaModal: () => void;
  handleCloseAgendaModal: () => void;
  handleSubmitOpenAgenda: (values: OpenAgendaData) => void;
}

const AgendaModal = ({
  form,
  agendaModalOpen,
  handleConfirmAgendaModal,
  handleCloseAgendaModal,
  handleSubmitOpenAgenda
}: AgendaModalProps) => {

  return (
    <Modal
      title="Abrir votação"
      open={agendaModalOpen}
      okText="Confirmar"
      cancelText="Cancelar"
      onOk={handleConfirmAgendaModal}
      onCancel={handleCloseAgendaModal}
      forceRender
      getContainer={false}
    >
      <Form
        id="pauta-form"
        onFinish={handleSubmitOpenAgenda}
        form={form}
        initialValues={{
          agendaId: -1,
          sessionDuration: 1
        }}
      >
        <Form.Item name="agendaId" style={{ display: "none" }}>
          <Input />
        </Form.Item>
        <Form.Item
          name="sessionDuration"
          label="Duração da votação"
          rules={[{ required: true, message: "Informe a duração da sessão" }]}
        >
          <InputNumber min={1} addonAfter="Minuto(s)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgendaModal;
