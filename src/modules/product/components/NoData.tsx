import { Col, Row, Space } from 'antd';
import { ReactSVG } from 'react-svg';
import ButtonComponent from '@/@components/form/button';
import NoDataImg from '@/assets/media/no-data.svg';

const NoData = ({
  title,
  description,
  buttonText,
  buttonLink,
}: {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}) => {
  return (
    <Row
      justify="space-between"
      align="middle"
      style={{ padding: '5rem 6.25rem', textAlign: 'start' }}
    >
      <Col span={10}>
        <Space size={28} direction="vertical">
          <div>
            <h2 className="base-black font-24">{title}</h2>
            <p className="neutrals-600 font-16">{description}</p>
          </div>
          {buttonLink && (
            <ButtonComponent
              href={buttonLink}
              type="primary"
              size="large"
              padding="10px 28px"
              borderRadius="4px"
            >
              {buttonText ?? 'Add New'}
            </ButtonComponent>
          )}
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

export default NoData;
