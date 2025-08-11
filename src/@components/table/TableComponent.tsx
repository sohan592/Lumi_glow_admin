import React, { Fragment, useState } from 'react';
import { Col, Row, Space, Table, Typography } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from 'antd/es/table';
import type { PaginationProps } from 'antd';
import { FallbackTableDataNotFound } from './FallbackData';
import { TableHeader } from './TableHeader';
import { TableFooter } from './TableFooter';
import { TableRowSelection } from 'antd/es/table/interface';
import ButtonComponent from '../form/button';
import DropDownComponent from '../dropdown';
import { RiMoreLine } from '@remixicon/react';
import CheckBoxComponent from '../form/checkbox';

const { Paragraph } = Typography;

export interface OnSelectionButton {
  title: string;
  actionType: 'link' | 'function';
  action: string | Function;
  isDefault?: boolean;
  icon?: any;
}

interface TableComponentProps {
  rowSelection?: TableProps<any>['rowSelection'];
  columns?: ColumnsType<any>;
  dataSource?: readonly any[];
  fallbackComponent?: React.ReactNode;
  leftHeaderComponent?: React.ReactNode;
  dropdownItems?: any;
  onSelectionButtons?: Array<OnSelectionButton>;
  selectedItems: Array<number>;
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  searchPlaceholder?: string;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setFilterStatus?: React.Dispatch<React.SetStateAction<string | null>>;
  totalData: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading?: boolean;
  limit?: number;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  columns = [],
  dataSource = [],
  fallbackComponent,
  dropdownItems,
  onSelectionButtons = [],
  selectedItems = [],
  setSelectedItems,
  setSearchKeyword,
  searchPlaceholder,
  totalData,
  currentPage,
  setCurrentPage,
  setFilterStatus,
  leftHeaderComponent,
  loading,
  limit = 10,
}) => {
  const [isSearchAndFilterOpen, setSearchAndFilterOpen] = useState(false);
  const defaultPagination: PaginationProps = {
    current: currentPage,
    total: totalData,
    pageSize: limit,
    onChange: (page) => {
      setCurrentPage(page);
    },
    onShowSizeChange: (_, showItem) => {
      console.log('showItem', showItem);

      // setLimit(showItem);
    },
    size: 'small',
    style: {
      display: 'flex',
      gap: 'var(--gap-xs)',
    },
  };

  const onRowSelection: TableRowSelection<any> = {
    selectedRowKeys: selectedItems,
    columnWidth: '4%',
    onChange: (_selectedRowKeys: React.Key[], selectedRows) => {
      const getId = selectedRows?.map((item) => item.id);
      setSelectedItems(getId);
    },
  };

  const tablePaginationConfig: TablePaginationConfig = {
    position: ['none', 'none'],
  };

  const tableLocale = {
    emptyText: () =>
      fallbackComponent ? fallbackComponent : <FallbackTableDataNotFound />,
  };

  return (
    <Table
      rowKey="id"
      rowSelection={{ type: 'checkbox', ...onRowSelection }}
      columns={columns}
      className="table-wrapper overflow-x-auto"
      size="middle"
      dataSource={dataSource}
      showHeader={
        dataSource.length === 0 || selectedItems.length > 0 ? false : true
      }
      title={() => (
        <Col className="w-full">
          <Col className="p-4 sm:p-6">
            <TableHeader
              dataSource={dataSource}
              isSearchAndFilterOpen={isSearchAndFilterOpen}
              setSearchAndFilterOpen={setSearchAndFilterOpen}
              dropdownItems={dropdownItems}
              setKeyword={setSearchKeyword}
              searchPlaceholder={searchPlaceholder}
              setFilterStatus={setFilterStatus}
              leftHeaderComponent={leftHeaderComponent}
            />
          </Col>

          {selectedItems.length > 0 && (
            <Col className="border-t border-neutral-100 p-4 sm:p-6">
              <Row
                gutter={[8, 8]}
                justify="space-between"
                align="middle"
                className="flex-col sm:flex-row"
              >
                <Col className="w-full sm:w-auto mb-4 sm:mb-0">
                  <Paragraph className="m-0">
                    <CheckBoxComponent
                      label={`${selectedItems.length} selected`}
                      isIndeterminate={
                        selectedItems.length > 0 &&
                        selectedItems.length < dataSource.length
                      }
                      isChecked={selectedItems.length === dataSource.length}
                      onChange={() => setSelectedItems([])}
                    />
                  </Paragraph>
                </Col>
                <Col className="w-full sm:w-auto">
                  <Row className="flex-col sm:flex-row gap-2">
                    <Space
                      className="w-full sm:w-auto flex flex-wrap gap-2"
                      direction="horizontal"
                    >
                      {onSelectionButtons?.map(
                        (button, idx) =>
                          button?.isDefault && (
                            <Fragment key={idx}>
                              {button?.actionType === 'link' ? (
                                <ButtonComponent
                                  href={button.action as string}
                                  className="w-full sm:w-auto"
                                >
                                  {button.title}
                                </ButtonComponent>
                              ) : (
                                <ButtonComponent
                                  className="w-full sm:w-auto"
                                  onClick={
                                    button.action as React.MouseEventHandler<HTMLElement>
                                  }
                                >
                                  {button.title}
                                </ButtonComponent>
                              )}
                            </Fragment>
                          ),
                      )}

                      {onSelectionButtons.length > 0 && (
                        <DropDownComponent
                          dropdownCardClassName="table-action-more"
                          items={onSelectionButtons
                            ?.filter((button) => !button?.isDefault)
                            ?.map((button, idx) => ({
                              key: idx,
                              label: (
                                <ButtonComponent
                                  type="text"
                                  className="w-full text-left"
                                  onClick={
                                    button.action as React.MouseEventHandler<HTMLElement>
                                  }
                                >
                                  {button.icon}
                                  {button.title}
                                </ButtonComponent>
                              ),
                            }))}
                        >
                          <ButtonComponent className="p-2">
                            <RiMoreLine size={18} />
                          </ButtonComponent>
                        </DropDownComponent>
                      )}
                    </Space>
                  </Row>
                </Col>
              </Row>
            </Col>
          )}
        </Col>
      )}
      pagination={{
        ...tablePaginationConfig,
        responsive: true,
        className: 'px-4 sm:px-6',
      }}
      footer={
        dataSource.length !== 0
          ? () => <TableFooter paginationProps={defaultPagination} />
          : undefined
      }
      locale={tableLocale}
      scroll={{ x: 'max-content' }}
      loading={loading}
    />
  );
};

export default TableComponent;
