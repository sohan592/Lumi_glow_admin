import CustomRadio from '@/@components/form/radio';
import SelectComponent from '@/@components/form/select';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import allTickets from '@/mock-data/all-tickets.json';
import NoData from '@/modules/product/components/NoData';
import SortDropDownData from '@/modules/tickets/list/sort-dropdown.json';
import tableColumnsListData from '@/modules/tickets/list/table-columns.json';
import {
  RiArchiveLine,
  RiArrowDownLine,
  RiArrowUpLine,
} from '@remixicon/react';
import type { MenuProps, TableProps } from 'antd';
import { Modal, Row } from 'antd';
import { lazy, useState } from 'react';
import NoteSubmissionForm from '../component/adminNote';
import { TicketDataType } from './types';
import LeftHeaderFilter from './leftHeaderFilter';
const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Tickets' },
];

export default function TicketsList() {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<TicketDataType>();

  console.log({
    sortBy,
    keyword,
    ids,
    currentPage,
    filterStatus,
  });

  const tableActions: TableProps<TicketDataType>['columns'] = [
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: (status: string, record) => (
        <SelectComponent
          style={{ width: 150 }}
          value={status}
          onChange={(_) => {
            setIsModalOpen(true);
            setTicketData(record);
          }}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'close', label: 'Close' },
          ]}
        />
      ),
    },
  ];

  const columns: TableProps<TicketDataType>['columns'] = [
    ...tableColumnsListData,
    ...tableActions,
  ];

  const data: TicketDataType[] = allTickets;

  const sortDropdown: MenuProps['items'] = [
    {
      label: 'Sort By',
      key: '0',
    },
    {
      label: (
        <CustomRadio
          options={SortDropDownData}
          onChange={(e) => setSortBy(e.target.value)}
        />
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <Row align="middle" onClick={() => setSortBy('A-Z')}>
          <RiArrowUpLine size={18} />
          <span>A-Z</span>
        </Row>
      ),
      key: '2',
    },
    {
      label: (
        <Row align="middle" onClick={() => setSortBy('A-Z')}>
          <RiArrowDownLine size={18} />
          <span>Z-A</span>
        </Row>
      ),
      key: '3',
    },
  ];

  const publishItem = () => {
    alert('Item published successfully');
  };

  const deleteItem = () => {
    alert('Deleted successfully');
  };

  const archiveItem = () => {
    alert('Archived successfully');
  };

  const onSelectionButtons: OnSelectionButton[] = [
    {
      title: 'Delete',
      actionType: 'function',
      action: deleteItem,
      isDefault: true,
    },
    {
      title: 'Set as Active',
      actionType: 'function',
      action: publishItem,
      isDefault: true,
    },
    {
      title: 'Set as Draft',
      actionType: 'function',
      action: publishItem,
      isDefault: true,
    },

    {
      title: 'Archived',
      actionType: 'function',
      action: archiveItem,
      icon: <RiArchiveLine size={18} />,
    },
  ];

  return (
    <>
      <BreadcrumbHeader pageTitle="Tickets" breadcrumbItems={breadcrumbItems} />

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={columns}
        dataSource={data}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
          />
        }
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        totalData={data.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setFilterStatus={setFilterStatus}
        leftHeaderComponent={<LeftHeaderFilter />}
      />
      <Modal
        title={`Note for ${ticketData?.name}`}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <NoteSubmissionForm />
      </Modal>
    </>
  );
}
