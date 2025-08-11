import { Col, Row } from 'antd';
import { Typography } from 'antd';
import { ReactSVG } from 'react-svg';
const { Title, Paragraph } = Typography;

import Image1 from '@/assets/media/image-93.svg';

export function FallbackTableDataNotFound() {
  return (
    <Row
      justify="space-between"
      align="middle"
      style={{
        padding: '5rem 6.25rem',
        textAlign: 'start',
      }}
    >
      <Col span={10}>
        <Title level={2}>No Data Found</Title>
        <Paragraph style={{ fontSize: '1rem', color: 'var(--neutrals-600' }}>
          We'd be grateful if you share your past memories with us.
        </Paragraph>
      </Col>
      <Col span={8}>
        <Row gutter={8} justify="end">
          <Col
            style={{
              backgroundColor: 'var(--base-white)',
              padding: '36px',
            }}
          >
            <ReactSVG src={Image1} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
