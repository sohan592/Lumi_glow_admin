import { Col, Row, Space } from 'antd';
import { ReactSVG } from 'react-svg';

import ButtonComponent from '@/@components/form/button';

import NoDataImg from '@/assets/media/no-data.svg';

const SizeGuideFallback = () => {
  return (
    <Row
      justify="space-between"
      align="middle"
      style={{ padding: '5rem 6.25rem', textAlign: 'start' }}
    >
      <Col span={10}>
        <Space size={28} direction="vertical">
          <div>
            <h2 className="base-black font-24">Product size guides</h2>
            <p className="neutrals-600 font-16">
              Start adding size guides to make product variants in your shop
            </p>
          </div>

          <Space>
            <ButtonComponent
              href="/products"
              size="large"
              padding="10px 28px"
              borderRadius="4px"
            >
              View all products
            </ButtonComponent>
            <ButtonComponent
              href="/products/size-guides/create"
              type="primary"
              size="large"
              padding="10px 28px"
              borderRadius="4px"
            >
              Add New Size Guide
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

export default SizeGuideFallback;
