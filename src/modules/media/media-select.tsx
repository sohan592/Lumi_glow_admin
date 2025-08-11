import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Space,
  Upload,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import debounce from 'lodash/debounce';
import React, { useEffect, useState } from 'react';
import {
  useAddFilesMutation,
  useGetMediasQuery,
  useGetMediasByIdsMutation,
} from '../appstore/media/media_api';
import { generateQueryString } from '../helpers/utils';

interface MediaSelectProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  maxCount?: number;
}

interface MediaMetadata {
  name: string;
  alt: string;
}

interface MediaItem {
  id: string;
  path: string;
  name: string;
  alt: string;
}

const MediaSelect: React.FC<MediaSelectProps> = ({
  value,
  onChange,
  multiple = false,
  maxCount,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(
    multiple ? (value as string[]) || [] : value ? [value as string] : [],
  );
  const [tempSelectedItems, setTempSelectedItems] = useState<string[]>([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [metadata, setMetadata] = useState<MediaMetadata[]>([]);
  const [selectedMediaData, setSelectedMediaData] = useState<MediaItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(21);

  const [addFiles, { isLoading: isUploading }] = useAddFilesMutation();
  const [getMediasByIds] = useGetMediasByIdsMutation();

  const payload = {
    limit: pageSize,
    page: currentPage,
    search: searchTerm,
  };
  const queryString = generateQueryString(payload);
  const { data: mediaData } = useGetMediasQuery(queryString);
  const [form] = Form.useForm();

  // Fetch selected media data when component mounts or selectedItems change
  useEffect(() => {
    const fetchSelectedMedia = async () => {
      if (selectedItems.length > 0) {
        try {
          const response = await getMediasByIds({
            ids: selectedItems,
          }).unwrap();
          setSelectedMediaData(response);
        } catch (error) {
          console.error('Error fetching selected media:', error);
          message.error('Failed to load selected media');
        }
      } else {
        setSelectedMediaData([]);
      }
    };

    fetchSelectedMedia();
  }, [selectedItems, getMediasByIds]);

  // Add effect to update selectedItems when value changes
  useEffect(() => {
    console.log('Value changed:', value);
    if (value) {
      setSelectedItems(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  useEffect(() => {
    if (visible) {
      setTempSelectedItems(selectedItems);
    }
  }, [visible]);

  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 500);

  const handleUpload = async () => {
    if (isUploading) return;
    if (fileList.length === 0) {
      setUploadModal(false);
      return;
    }
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

  const handleSelect = () => {
    if (multiple) {
      onChange?.(tempSelectedItems);
    } else {
      onChange?.(tempSelectedItems[0]);
    }
    setSelectedItems(tempSelectedItems);
    setVisible(false);
  };

  const handleRemove = async (itemId: string) => {
    const newItems = selectedItems.filter((id) => id !== itemId);
    setSelectedItems(newItems);

    if (multiple) {
      onChange?.(newItems);
    } else {
      onChange?.('');
    }

    try {
      if (newItems.length > 0) {
        const response = await getMediasByIds({ ids: newItems }).unwrap();
        setSelectedMediaData(response);
      } else {
        setSelectedMediaData([]);
      }
    } catch (error) {
      console.error('Error updating media data after remove:', error);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Preview Area */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {selectedMediaData.map((item) => (
            <div key={item.id} className="relative group h-40 w-40">
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}/${item.path}`}
                alt={item.alt}
                className="h-full w-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-medium truncate mb-2">
                    {item.name}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `${import.meta.env.VITE_IMAGE_URL}/${item.path}`,
                          '_blank',
                        );
                      }}
                    />
                    <Button
                      size="small"
                      danger
                      ghost
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!maxCount || selectedItems.length < maxCount) && (
            <div className="h-40 w-40">
              <Button
                onClick={() => setVisible(true)}
                className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 hover:border-blue-500 group transition-all duration-300 ease-in-out"
              >
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <PlusOutlined className="text-2xl text-gray-400 group-hover:text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-500 group-hover:text-blue-500">
                    Add Media
                  </p>
                  {maxCount && (
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedItems.length} / {maxCount}
                    </p>
                  )}
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Media Library Modal */}
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        width="90vw"
        style={{ top: 20 }}
        footer={
          <div className="flex justify-between px-6 py-4 bg-gray-50">
            <div className="text-sm text-gray-600">
              {tempSelectedItems.length} items selected
            </div>
            <Space>
              <Button onClick={() => setVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSelect}>
                Select{' '}
                {tempSelectedItems.length > 0 &&
                  `(${tempSelectedItems.length})`}
              </Button>
            </Space>
          </div>
        }
      >
        <div className="flex h-[80vh]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4 space-y-4">
            <Input
              placeholder="Search media..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setUploadModal(true)}
              block
            >
              Upload New Media
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {mediaData?.data.map((item: MediaItem) => (
                <div
                  key={item.id}
                  className={`group relative rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer ${
                    tempSelectedItems.includes(item.id)
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : ''
                  }`}
                  onClick={() => {
                    if (multiple) {
                      if (tempSelectedItems.includes(item.id)) {
                        setTempSelectedItems(
                          tempSelectedItems.filter((id) => id !== item.id),
                        );
                      } else {
                        setTempSelectedItems([...tempSelectedItems, item.id]);
                      }
                    } else {
                      setTempSelectedItems([item.id]);
                    }
                  }}
                >
                  <div className="aspect-square">
                    <img
                      src={`${import.meta.env.VITE_IMAGE_URL}/${item.path}`}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  {tempSelectedItems.includes(item.id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Pagination
                align="end"
                current={currentPage}
                pageSize={pageSize}
                total={mediaData?.count}
                onChange={(page) => setCurrentPage(page)}
                onShowSizeChange={(_, size) => setPageSize(size)}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} items`
                }
              />
            </div>
          </div>
        </div>
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
    </>
  );
};

export default MediaSelect;
