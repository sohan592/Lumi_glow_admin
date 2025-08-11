import ButtonComponent from '@/@components/form/button';
import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import {
  useBulkTagStatusChangeMutation,
  useDeleteTagsMutation,
  useGetTagsQuery,
} from '@/modules/appstore/tags/tagsApi';
import {
  generateNestedQueryString,
  generateQueryString,
  getSortBy,
  getStatusNumber,
} from '@/modules/helpers/utils';
import SortDropDownData from '@/modules/product/tag/sort-dropdown.json';
import tableColumnsListData from '@/modules/product/tag/table-columns.json';
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
import { Alert, Modal, Row, Spin, notification } from 'antd';
import { lazy, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const TagList = () => {
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
      name: keyword,
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

  const {
    data: tags,
    isLoading,
    isError,
    isFetching,
  } = useGetTagsQuery(queryParam);
  const [deleteTag] = useDeleteTagsMutation();
  const [bulkStatusChange] = useBulkTagStatusChangeMutation();

  const navigate = useNavigate();

  const handleEditTag = (data: any) => {
    navigate(`/products/tag/edit/${data?.id}`);
  };

  const handleDeleteTag = (id: number[]) => {
    const payload = { ids: id };
    const queryString = generateQueryString(payload);

    try {
      deleteTag(queryString);
      notification.success({ message: 'Tag deleted successfully!' });
      setIds([]);
    } catch (error) {
      notification.error({
        message: 'Failed to delete tag',
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
            <RiEditLine size={20} onClick={() => handleEditTag(data)} />
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

  const breadcrumbItems = [{ title: 'Dashboard', url: '/' }, { title: 'Tags' }];

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
          onOk: () => handleDeleteTag(ids),
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

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" tip="Loading..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <Alert
          message="Error"
          description="There was an error fetching the data."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbHeader pageTitle="Tags" breadcrumbItems={breadcrumbItems}>
        {tags?.data.length > 0 && (
          <ButtonComponent
            href="/products/tags/add"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Create Tag
          </ButtonComponent>
        )}
      </BreadcrumbHeader>

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={columns}
        dataSource={tags?.data || []}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
            buttonLink="/products/tags/add"
          />
        }
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        totalData={tags?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setFilterStatus={setFilterStatus}
        loading={isFetching}
      />
    </>
  );
};

export default TagList;
