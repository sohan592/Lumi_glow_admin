import ButtonComponent from '@/@components/form/button';
import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import {
  useBulkAttributeStatusChangeMutation,
  useDeleteAttributeMutation,
  useGetAttributesQuery,
} from '@/modules/appstore/attribute/attributeApi';
import {
  generateNestedQueryString,
  generateQueryString,
  getSortBy,
  getStatusNumber,
} from '@/modules/helpers/utils';
import SortDropDownData from '@/modules/product/attributes/sort-dropdown.json';
import tableColumnsListData from '@/modules/product/attributes/table-columns.json';
import NoData from '@/modules/product/components/NoData';
import { PlusOutlined } from '@ant-design/icons';
import {
  RiArchiveLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';
import type { MenuProps, TableProps } from 'antd';
import { Modal, Row, notification } from 'antd';
import { lazy, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const AttributeList = () => {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | undefined>('DESC');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const queryParam = generateNestedQueryString({
    page: currentPage,
    limit: 10,
    filters: {
      internalName: keyword,
      status:
        filterStatus && filterStatus !== 'All'
          ? [{ id: getStatusNumber(filterStatus) }]
          : undefined,
    },
    sort: [
      {
        orderBy: getSortBy(sortBy) ?? 'id',
        order: sortOrder,
      },
    ],
  });

  const { data: attributes, isFetching } = useGetAttributesQuery(queryParam);
  const [deleteAttribute] = useDeleteAttributeMutation();
  const [bulkStatusChange] = useBulkAttributeStatusChangeMutation();

  const navigate = useNavigate();

  const handleEditAttribute = (data: any) => {
    navigate(`/products/attributes/edit/${data?.id}`);
  };

  const handleDeleteAttribute = (id: number[]) => {
    const payload = { ids: id };
    const queryString = generateQueryString(payload);

    try {
      deleteAttribute(queryString);
      notification.success({ message: 'Attribute deleted successfully!' });
      setIds([]);
    } catch (error) {
      notification.error({
        message: 'Failed to delete attribute',
        description: (error as any).message,
      });
    }
  };

  const handleStatusChange = (id: number[], status: number) => {
    const payload = { ids: id, status };
    const queryString = generateQueryString(payload);

    try {
      bulkStatusChange(queryString);
      notification.success({ message: 'Status changed successfully!' });
      setIds([]);
    } catch (error) {
      notification.error({
        message: 'Failed to change status',
        description: (error as any).message,
      });
    }
  };

  const tableActions: TableProps<any>['columns'] = [
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              status?.name === 'ACTIVE'
                ? 'bg-green-50 text-green-700 ring-green-600/20'
                : status?.name === 'DRAFT'
                  ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                  : 'bg-red-50 text-red-700 ring-red-600/20'
            }`}
          >
            {status?.name}
          </span>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'actions',
      render: (data) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button>
            <RiEditLine size={20} onClick={() => handleEditAttribute(data)} />
          </button>
          <button
            onClick={() => {
              if (data?.status?.name === 'DELETED') {
                return notification.error({
                  message: 'Tag already deleted!',
                });
              }
              Modal.confirm({
                title: 'Delete Tag',
                content: 'Are you sure you want to delete this tag?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => handleStatusChange([data?.id], 3),
              });
            }}
          >
            <RiDeleteBinLine size={20} />
          </button>
        </div>
      ),
    },
  ];

  const columns: TableProps<any>['columns'] = [
    ...tableColumnsListData,
    ...tableActions,
  ];

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Attributes' },
  ];

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
          setDataSortOrder={setSortOrder}
          value={sortBy}
        />
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <Row
          align="middle"
          onClick={() => {
            setSortBy('A-Z');
            setSortOrder('ASC');
          }}
        >
          <RiArrowUpLine size={18} />
          <span>A-Z</span>
        </Row>
      ),
      key: '2',
    },
    {
      label: (
        <Row
          align="middle"
          onClick={() => {
            setSortBy('Z-A');
            setSortOrder('DESC');
          }}
        >
          <RiArrowDownLine size={18} />
          <span>Z-A</span>
        </Row>
      ),
      key: '3',
    },
  ];

  const onSelectionButtons: OnSelectionButton[] = [
    {
      title: 'Force Delete',
      actionType: 'function',
      action: () => {
        Modal.confirm({
          title: 'Force Delete Tag',
          content:
            'Are you sure you want to delete these tags? Deleting this will permanently remove the data.',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => handleDeleteAttribute(ids),
        });
      },
      isDefault: true,
    },
    {
      title: 'Set as Active',
      actionType: 'function',
      action: () => {
        Modal.confirm({
          title: 'Activate Tags',
          content: 'Are you sure you want to activate these tags?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => handleStatusChange(ids, 1),
        });
      },
      isDefault: true,
    },
    {
      title: 'Set as Draft',
      actionType: 'function',
      action: () => {
        Modal.confirm({
          title: 'Draft Tags',
          content: 'Are you sure you want to draft these tags?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => handleStatusChange(ids, 4),
        });
      },
      icon: <RiArchiveLine size={18} />,
    },
    {
      title: 'Set as Deleted',
      actionType: 'function',
      action: () => {
        Modal.confirm({
          title: 'Delete Tags',
          content: 'Are you sure you want to delete these tags?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => handleStatusChange(ids, 3),
        });
      },
      icon: <RiDeleteBinLine size={18} />,
    },
  ];

  return (
    <>
      <BreadcrumbHeader
        pageTitle="Attributes"
        breadcrumbItems={breadcrumbItems}
      >
        {attributes?.data.length > 0 && (
          <ButtonComponent
            href="/products/attributes/create"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Create Attribute
          </ButtonComponent>
        )}
      </BreadcrumbHeader>

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={columns}
        dataSource={attributes?.data || []}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
            buttonLink="/products/attributes/create"
          />
        }
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        totalData={attributes?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setFilterStatus={setFilterStatus}
        loading={isFetching}
      />
    </>
  );
};

export default AttributeList;
