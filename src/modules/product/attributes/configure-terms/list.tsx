import { useState, lazy } from 'react';

import { Row } from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { RiArrowDownLine, RiArrowUpLine, RiCircleFill } from '@remixicon/react';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));
import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';

import ConfigureTermsFallback from './components/ConfigureTermsFallback';

interface DataType {
  id: string;
  name: string;
  color: string;
  description?: string;
  slug: string;
  count: number;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Image',
    dataIndex: 'color',
    render: (text) => <RiCircleFill color={text} size={18} />,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    render: (text) => <span>{text || '-'}</span>,
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
  },
  {
    title: 'Count',
    dataIndex: 'count',
  },
];

const data: DataType[] = [
  {
    id: '1',
    name: 'Red',
    color: '#FF2900',
    slug: 'red',
    count: 9,
  },
  {
    id: '2',
    name: 'Black',
    color: '#1A1A1A',
    slug: 'black',
    count: 3,
  },
  {
    id: '3',
    name: 'Dark Grey Heather',
    color: '#AFAFAF',
    slug: 'dark-grey-heather',
    count: 1,
  },
  {
    id: '4',
    name: 'Deep Maroon',
    color: '#8E1700',
    slug: 'deep-maroon',
    count: 7,
  },
  {
    id: '5',
    name: 'Orange',
    color: '#FFA800',
    slug: 'orange',
    count: 20,
  },
  {
    id: '6',
    name: 'Yellow Strike',
    color: '##FFE500',
    slug: 'yellow-strike',
    count: 10,
  },
  {
    id: '7',
    name: 'Black',
    color: '#1A1A1A',
    slug: 'black',
    count: 3,
  },
  {
    id: '8',
    name: 'Dark Grey Heather',
    color: '#AFAFAF',
    slug: 'dark-grey-heather',
    count: 1,
  },
  {
    id: '9',
    name: 'Deep Maroon',
    color: '#8E1700',
    slug: 'deep-maroon',
    count: 7,
  },
];

const options = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Count',
    value: 'count',
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
  { title: 'Attributes', url: '/products/attributes' },
  { title: 'Configure Terms' },
];

export default function ConfigureTermsList() {
  const [ids, setIds] = useState<Array<number>>([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  console.log({
    ids,
    keyword,
    currentPage,
  });

  return (
    <>
      <BreadcrumbHeader breadcrumbItems={breadcrumbItems}>
        {data.length > 0 && (
          <ButtonComponent
            href="/products/attributes/configure-terms/create"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Add new
          </ButtonComponent>
        )}
      </BreadcrumbHeader>

      <TableComponent
        setSearchKeyword={setKeyword}
        dropdownItems={dropdownItems}
        columns={columns}
        dataSource={data}
        fallbackComponent={<ConfigureTermsFallback />}
        selectedItems={ids}
        setSelectedItems={setIds}
        currentPage={1}
        totalData={50}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
