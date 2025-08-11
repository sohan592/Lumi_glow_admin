import {
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import debounce from 'lodash/debounce';
import { useState } from 'react';
import {
  useAddFilesMutation,
  useDeleteMediaMutation,
  useGetMediasQuery,
} from '../appstore/media/media_api';
import { generateQueryString } from '../helpers/utils';

// Placeholder functions for missing API calls. Replace with real implementations.

interface MediaMetadata {
  name: string;
  alt: string;
}

interface MediaItem {
  id: string;
  path: string;
  name: string;
  alt: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

function MediaList() {
  const [viewModal, setViewModal] = useState<{
    visible: boolean;
    item?: MediaItem;
  }>({ visible: false });
  const [uploadModal, setUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [metadata, setMetadata] = useState<MediaMetadata[]>([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [deleteMediaData] = useDeleteMediaMutation();
  const [addFiles, { isLoading: isUploading }] = useAddFilesMutation();

  const payload = {
    limit: limit,
    page: page,
    search: searchTerm,
  };
  const queryString = generateQueryString(payload);

  const {
    data: mediaData,
    isError,
    isLoading,
  } = useGetMediasQuery(queryString);

  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Preview',
      dataIndex: 'path',
      render: (path: string) => (
        <img
          src={`${import.meta.env.VITE_IMAGE_URL}/${path}`}
          alt=""
          className="w-20 h-20 object-cover rounded"
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (size: number) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      render: (_: any, record: MediaItem) => (
        <Space>
          <EyeOutlined
            className="text-blue-500 cursor-pointer"
            onClick={() => setViewModal({ visible: true, item: record })}
          />
          <DeleteOutlined
            className="text-red-500 cursor-pointer"
            onClick={() => {
              Modal.confirm({
                title: 'Delete Media',
                content: 'Are you sure you want to delete this media?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaData(id);
      message.success('Media deleted successfully');
    } catch (error) {
      message.error('Failed to delete media');
    }
  };

  const handleUpload = async () => {
    if (!fileList.length) {
      setUploadModal(false);
      return;
    }
    if (isUploading) return;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files', file.originFileObj as File);
    });
    formData.append('metadata', JSON.stringify(metadata));

    try {
      await addFiles(formData);
      setUploadModal(false);
      form.resetFields();
      setFileList([]);
      setMetadata([]);
      message.success('Media uploaded successfully');
    } catch (error) {
      message.error('Upload failed');
    }
  };
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
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Input
          placeholder="Search media..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setUploadModal(true)}
        >
          Add Media
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mediaData?.data}
        rowKey="id"
        pagination={{
          total: mediaData?.count,
          pageSize: limit,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          setPage(pagination.current || 1);
          setLimit(pagination.pageSize || 10);
        }}
      />

      {/* View Modal */}
      <Modal
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false })}
        footer={null}
        width="80vw"
        centered
        className="media-viewer-modal"
        bodyStyle={{ padding: 0 }}
      >
        {viewModal.item && (
          <div className="flex flex-col md:flex-row h-[80vh]">
            {/* Image Container */}
            <div className="relative flex-1 bg-gray-900">
              {/* Image */}
              <div className="h-full flex items-center justify-center p-4">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${viewModal.item.path}`}
                  alt={viewModal.item.alt}
                  className="max-h-full max-w-full object-contain select-none"
                  style={{ objectFit: 'contain' }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.parentElement?.querySelector('.loading')?.remove();
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.png';
                  }}
                />
              </div>

              {/* Image Controls */}
              {/* <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <Button
                    type="text"
                    icon={<ZoomInOutlined />}
                    className="text-white hover:text-white/80"
                  />
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    className="text-white hover:text-white/80"
                    onClick={() =>
                      window.open(
                        `${import.meta.env.VITE_IMAGE_URL}/${viewModal?.item?.path}`,
                        '_blank',
                      )
                    }
                  />
                </div>
              </div> */}
            </div>

            {/* Metadata Sidebar */}
            <div className="w-full md:w-80 bg-white p-6 overflow-y-auto border-l border-gray-200">
              <div className="space-y-6">
                {/* File Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {viewModal.item.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Alt Text</label>
                      <p className="text-gray-700">{viewModal.item.alt}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">File Type</label>
                      <p className="text-gray-700">{viewModal.item.mimeType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Size</label>
                      <p className="text-gray-700">
                        {(viewModal.item.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Uploaded</label>
                      <p className="text-gray-700">
                        {new Date(
                          viewModal.item.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <Space direction="vertical" className="w-full">
                    <Button
                      icon={<CopyOutlined />}
                      block
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${import.meta.env.VITE_IMAGE_URL}/${viewModal?.item?.path}`,
                        );
                        message.success('URL copied to clipboard');
                      }}
                    >
                      Copy URL
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal
        title="Upload Media"
        open={uploadModal}
        onCancel={() => setUploadModal(false)}
        onOk={handleUpload}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => {
              const newFileList = fileList;
              const newMetadata = newFileList.map((file) => ({
                name: file.name.split('.')[0],
                alt: file.name.split('.')[0],
              }));
              setMetadata(newMetadata);
              setFileList(newFileList);
            }}
            multiple
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              const isLt5M = file.size / 1024 / 1024 <= 5;

              if (!isImage) {
                message.error('You can only upload image files!');
                return Upload.LIST_IGNORE;
              }
              if (!isLt5M) {
                message.error('Image must be smaller than or equal to 5MB!');
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>

          {fileList.length > 0 && (
            <Card className="mt-4">
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">File</th>
                      <th className="text-left pb-2">Name</th>
                      <th className="text-left pb-2">Alt Text</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileList.map((file, index) => (
                      <tr key={index}>
                        <td className="py-1">
                          <img
                            src={URL.createObjectURL(
                              file.originFileObj as Blob,
                            )}
                            alt=""
                            className="w-10 h-10 object-cover rounded"
                          />
                        </td>
                        <td className="py-1">
                          <Input
                            size="small"
                            value={metadata[index]?.name}
                            onChange={(e) => {
                              const newMetadata = [...metadata];
                              newMetadata[index] = {
                                ...newMetadata[index],
                                name: e.target.value,
                              };
                              setMetadata(newMetadata);
                            }}
                          />
                        </td>
                        <td className="py-1">
                          <Input
                            size="small"
                            value={metadata[index]?.alt}
                            onChange={(e) => {
                              const newMetadata = [...metadata];
                              newMetadata[index] = {
                                ...newMetadata[index],
                                alt: e.target.value,
                              };
                              setMetadata(newMetadata);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default MediaList;
