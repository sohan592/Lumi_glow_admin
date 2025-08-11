import { Row } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, lazy } from 'react';
import { Link } from 'react-router-dom';
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));
import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';

import SizeGuideFallback from './components/SizeGuideFallback';

interface DataType {
  id: string;
  title: string;
  date: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Title',
    dataIndex: 'title',
    render: (text) => <Link to="/products/size-guides">{text}</Link>,
  },
  {
    title: 'Date',
    dataIndex: 'date',
  },
];

const data: DataType[] = [
  {
    id: '1',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 9:30 am',
  },
  {
    id: '2',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:00 am',
  },
  {
    id: '3',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:30 am',
  },
  {
    id: '4',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:00 am',
  },
  {
    id: '5',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:30 am',
  },
  {
    id: '6',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:00 am',
  },
  {
    id: '7',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:30 am',
  },
  {
    id: '8',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:00 am',
  },
  {
    id: '9',
    title: 'Size and packaging guidelines',
    date: '15 May 2020 8:30 am',
  },
];

const options = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Created',
    value: 'created',
  },
  {
    label: 'Updated',
    value: 'updated',
  },
];

const dropdownItems: MenuProps['items'] = [
  {
    label: <b>Sort By</b>,
    key: '0',
  },
  {
    label: <CustomRadio options={options} />,
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <Row align="middle">
        <RiArrowUpLine size={18} />
        <span>A-Z</span>
      </Row>
    ),
    key: '2',
  },
  {
    label: (
      <Row align="middle">
        <RiArrowDownLine size={18} />
        <span>Z-A</span>
      </Row>
    ),
    key: '3',
  },
];

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Size Guidelines' },
];

export default function SizeGuideList() {
  const [ids, setIds] = useState<Array<number>>([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  console.log({
    keyword,
    currentPage,
  });

  return (
    <>
      <BreadcrumbHeader
        pageTitle="Size Guidelines"
        breadcrumbItems={breadcrumbItems}
      >
        {data.length > 0 && (
          <ButtonComponent
            href="/products/size-guides/create"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Create New
          </ButtonComponent>
        )}
      </BreadcrumbHeader>
      {/* @ts-ignore */}
      <TableComponent
        setSearchKeyword={setKeyword}
        dropdownItems={dropdownItems}
        columns={columns}
        dataSource={data}
        fallbackComponent={<SizeGuideFallback />}
        selectedItems={ids}
        setSelectedItems={setIds}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
