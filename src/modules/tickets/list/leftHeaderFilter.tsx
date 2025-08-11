import { Button, Col, Row } from 'antd';
import { useState } from 'react';

type FilterStatus = 'All' | 'Open' | 'Rejected' | 'Closed';

const LeftHeaderFilter = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');

  const handleFilterClick = (status: FilterStatus) => {
    setActiveFilter(status);
  };
  return (
    <Row gutter={[16, 16]}>
      <Col>
        <Button
          type={activeFilter === 'All' ? 'primary' : 'text'}
          onClick={() => handleFilterClick('All')}
        >
          All
        </Button>
      </Col>

      {(['Open', 'Rejected', 'Closed'] as const).map((status) => (
        <Col key={status}>
          <Button
            type={activeFilter === status ? 'primary' : 'text'}
            onClick={() => handleFilterClick(status)}
          >
            {status}
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default LeftHeaderFilter;
