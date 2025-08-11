import ButtonComponent from '@/@components/form/button';
import { Card, Col, Flex, Form, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import AuthCustomInput from './components/AuthCustomInput';

import './auth-style.scss';

type FieldType = {
  name?: string;
  password?: string;
  remember?: string;
  email?: string;
  phone?: string;
  confirmPassword?: string;
};
const Register = () => {
  const cardStyle = {
    maxWidth: '500px',
    padding: '0 20px 20px 20px',
    borderRadius: 4,
    border: '1px solid #DBDADE',
  };

  const authTitle = {
    color: '#2D2E54',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '120%',
  };

  const authSubText = {
    color: '#666371',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  };

  return (
    <>
      <Content className="auth-container">
        <Flex justify="center" align="center" vertical>
          <Card style={cardStyle}>
            <Row justify={'center'}>
              <Col>
                <div
                  style={{ margin: '0 40px 30px 40px', textAlign: 'center' }}
                >
                  <h2 style={authTitle}>Create an Account</h2>
                  <p style={authSubText}>to continue to bdestore</p>
                </div>
              </Col>
            </Row>

            <Form>
              <Row justify={'center'}>
                <Col span={24}>
                  <Form.Item<FieldType>
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your fullname!',
                      },
                    ]}
                  >
                    <AuthCustomInput type={'text'} placeholder={'Full Name'} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item<FieldType>
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your eamail!',
                      },
                    ]}
                  >
                    <AuthCustomInput type={'text'} placeholder={'Email'} />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item<FieldType>
                    name="phone"
                    rules={[
                      { required: true, message: 'Please input your phone!' },
                    ]}
                  >
                    <AuthCustomInput
                      type={'text'}
                      placeholder={'Mobile number'}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item<FieldType>
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <AuthCustomInput
                      type={'password'}
                      placeholder={'Password'}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item<FieldType>
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <AuthCustomInput
                      type={'password'}
                      placeholder={'Confirm Password'}
                    />
                  </Form.Item>
                  <div className="password-suggestion-wrapper">
                    <p className="auth-small-text">
                      Use at least 8 characters. mix of numbers & letters
                    </p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <ButtonComponent
                    backgroundColor="#F15A3A"
                    buttonColor="#FAFAFA"
                    fontWeight="400"
                    size="large"
                    fontSize="16"
                    fullWidth
                    htmlType="submit"
                  >
                    Register
                  </ButtonComponent>
                </Col>
              </Row>
            </Form>
            <div className="auth-toggle-wrapper">
              <p className="auth-toggle-login-register-text">
                Already a Member?{' '}
                <Link className="auth-toggle-span-color" to={'/login'}>
                  {' '}
                  Log In
                </Link>
              </p>
            </div>
          </Card>
          <div className="condition-wrapper">
            <p className="condition-text">
              {' '}
              by Proceeding, you agree to{' '}
              <Link className="auth-toggle-span-color" to={'#'}>
                Terms of Use
              </Link>{' '}
              and{' '}
            </p>
            <p className="condition-text">
              {' '}
              <Link className="auth-toggle-span-color" to={'#'}>
                Privacy Policy
              </Link>{' '}
              of bdestore
            </p>
          </div>
        </Flex>
      </Content>
    </>
  );
};

export default Register;
