import ButtonComponent from '@/@components/form/button';
import { Card, Col, Flex, Form, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import AuthCustomInput from './components/AuthCustomInput';

('./auth-style.scss');

type FieldType = {
  email?: string;
};

const ForgotPassword = () => {
  return (
    <>
      <Content className="auth-container">
        <Flex justify="center" align="center" vertical>
          <Card className="auth-card-style">
            <Row justify={'center'}>
              <Col>
                <div
                  style={{ margin: '0 40px 30px 40px', textAlign: 'center' }}
                >
                  <h2 className="auth-title">Forgot Password</h2>
                  <p className="auth-subtitle">to continue to bdestore</p>
                </div>
              </Col>
              <Col>
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <p className="auth-small-text">
                    Enter your account email address and we’ll email you a link
                    so that you can reset your password
                  </p>
                </div>
              </Col>
            </Row>

            <Form>
              <Row justify={'center'}>
                <Col span={24}>
                  <Form.Item<FieldType> name="email">
                    <AuthCustomInput
                      type={'text'}
                      placeholder={'Enter your email address here'}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item className="no-margin">
                    <ButtonComponent
                      backgroundColor="#F15A3A"
                      buttonColor="#FAFAFA"
                      fontWeight="400"
                      size="large"
                      fontSize="16"
                      padding="23px 10px"
                      fullWidth
                      htmlType="submit"
                    >
                      Log In
                    </ButtonComponent>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className="auth-toggle-wrapper">
              <p className="auth-toggle-login-register-text">
                New User?{' '}
                <Link className="auth-toggle-span-color" to={'/register'}>
                  {' '}
                  Create an Account{' '}
                </Link>
              </p>
            </div>
          </Card>
          <div className="condition-wrapper">
            <p className="condition-text" style={{ marginBottom: '4px' }}>
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

export default ForgotPassword;
