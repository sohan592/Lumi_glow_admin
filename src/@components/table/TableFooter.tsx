import { Pagination, PaginationProps, Row } from 'antd';
import { Typography } from 'antd';

const { Text } = Typography;

interface TableFooterProps {
  paginationProps: PaginationProps;
}

export function TableFooter({ paginationProps }: TableFooterProps) {
  const currentPage = paginationProps.current || 1;
  const pageSize = paginationProps.pageSize || 10;
  const total = paginationProps.total || 0;

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, total);

  return (
    <Row justify="space-between" align="middle" className="table-footer px-4">
      <Row className="gap-2">
        <span>Showing</span>
        <Text strong>{`${startRange}-${endRange}`}</Text>
        <span>of</span>
        <Text strong>{total}</Text>
        <span>Results</span>
      </Row>
      <Pagination {...paginationProps} />
    </Row>
  );
}
