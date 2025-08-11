import { Col, Row, Space } from 'antd';
import { ReactSVG } from 'react-svg';

import ButtonComponent from '@/@components/form/button';

import NoDataImg from '@/assets/media/no-data.svg';

const ConfigureTermsFallback = () => {
  return (
    <Row
      justify="space-between"
      align="middle"
      style={{ padding: '5rem 6.25rem', textAlign: 'start' }}
    >
      <Col span={10}>
        <Space size={28} direction="vertical">
          <div>
            <h2 className="base-black font-24">Attributes configure terms</h2>
            <p className="neutrals-600 font-16">
              Start configuring terms for your attributes
            </p>
          </div>

          <Space>
            <ButtonComponent
              href="/products/attributes"
              size="large"
              padding="10px 28px"
              borderRadius="4px"
            >
              View attributes
            </ButtonComponent>
            <ButtonComponent
              href="/products/attributes/configure-terms/create"
              type="primary"
              size="large"
              padding="10px 28px"
              borderRadius="4px"
            >
              Add New
            </ButtonComponent>
          </Space>
        </Space>
      </Col>

      <Col span={8}>
        <Row gutter={8} justify="end">
          <Col
            style={{
              backgroundColor: 'var(--base-white)',
              padding: '36px',
            }}
          >
            <ReactSVG src={NoDataImg} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ConfigureTermsFallback;
