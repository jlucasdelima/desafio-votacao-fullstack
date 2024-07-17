import { UserOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Row } from "antd";
import { MaskedInput } from "antd-mask-input";
import { logIn } from "../../services/user.sevice";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../providers/UserProvider";
import './index.css';
import Title from "antd/es/typography/Title";

function Home() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  type logInProps = {
    cpf: string,
  }

  const onFinish = (values: logInProps) => {
    logIn(values.cpf)
      .then((response) => {
        setUser(response);
        navigate('/pautas');
      });
  };
  
  return (
    <section className="page">
      <Title level={2} style={{ margin: 0 }}>Desafio Votação</Title>
      <Row className="title-divider">
        <Col xs={24} md={12} xl={8}>
          <Divider />
        </Col>
      </Row>
      <Form
        name="user-login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item<logInProps>
          name="cpf"
          rules={[
            { required: true, message: 'Informe o CPF.' },
            { min: 14, message: 'CPF inválido.' },
          ]}
        >
          <MaskedInput
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="CPF"
            mask="000.000.000-00"
            maskOptions={{
              lazy: true,
            }}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Entrar
        </Button>
      </Form>
    </section>
  )
}

export default Home
