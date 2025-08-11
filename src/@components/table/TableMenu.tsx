import { Col, Row } from 'antd';
import { useState } from 'react';
import Button from '../form/button';

type FilterStatus = 'All' | 'Active' | 'Draft' | 'Deleted';

interface TableMenuItemsProps {
  dataSource?: any;
  setFilterStatus: React.Dispatch<React.SetStateAction<string | null>>;
}

export function TableMenuItems({ setFilterStatus }: TableMenuItemsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');

  const handleFilterClick = (status: FilterStatus) => {
    setActiveFilter(status);
    setFilterStatus(status);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col>
        <Button
          type={activeFilter === 'All' ? 'primary' : 'text'}
          onClick={() => handleFilterClick('All')}
          // disabled={emptyData}
        >
          All
        </Button>
      </Col>

      {(['Active', 'Draft', 'Deleted'] as const).map((status) => (
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
}
