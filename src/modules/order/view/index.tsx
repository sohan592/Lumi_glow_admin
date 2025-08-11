import {
  useGetOrderStatsHistoryQuery,
  useGetViewOrderQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
} from '@/modules/appstore/orders/ordersAPI';
import { RiEditLine } from '@remixicon/react';
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Steps,
  Tag,
} from 'antd';
import { Option } from 'antd/es/mentions';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();

  // Fetching order data from the API
  const { data: order, isFetching } = useGetViewOrderQuery(orderId);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { data: orderhistory } = useGetOrderStatsHistoryQuery(orderId);
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  // const [quantity, setQuantity] = useState(order?.items?.[0]?.quantity || 1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [_, setIsUpdateModalVisible] = useState(false);
  const [details, setDetails] = useState('');

  const [status, setStatus] = useState('Select Status');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const { Step } = Steps;
  const { TextArea } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const incrementQuantity = () => {
  //   setQuantity((prev: any) => prev + 1);
  // };

  // const decrementQuantity = () => {
  //   setQuantity((prev: any) => (prev > 1 ? prev - 1 : 1));
  // };

  // const showDeleteModal = () => {
  //   setIsModalVisible(true);
  // };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirmDelete = () => {
    console.log('Item Deleted', order?.items[0].name);
    setIsModalVisible(false);
  };

  const handleStatusChange = (value: any, option: any) => {
    setStatusTitle(option.label);
    setStatus(value);
  };

  const handleStatusNoteChange = (e: any) => {
    setStatusNote(e.target.value);
  };

  const handleUpdate = () => {
    updateOrderStatus({
      id: orderId,
      body: { note: statusNote, title: statusTitle },
      statusId: status,
    });
    setIsUpdateModalVisible(true);
    setStatusNote('');
    setStatus('Select Status');
  };
  const handleUpdatePayment = () => {
    if (!orderId) return;

    updatePaymentStatus({
      id: orderId,
      body: {
        status,
        details,
      },
    })
      .unwrap()
      .then(() => {
        handleCloseModal();
        setStatus('Select Status');
        setDetails('');
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An error occurred while updating payment status';
        console.error('Error updating payment status:', errorMessage);
      });
  };
  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-1 gap-6">
        {/* Left Section */}
        <Card className="p-0 lg:p-0">
          <div>
            {/* Order Status Card */}
            <Card loading={isFetching} className="p-0 lg:p-0">
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    Order ID: {order?.id}
                  </p>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                  <Tag color="blue" className=" px-1 py-1">
                    {order?.status?.name}
                  </Tag>
                </Col>
              </Row>

              <Divider style={{ margin: '10px' }} />
              {order?.items?.map((item: any, index: number) => (
                <Row
                  key={index}
                  gutter={[16, 16]}
                  align="middle"
                  className="mb-4"
                >
                  {/* Product Image */}
                  <Col
                    xs={24}
                    sm={12}
                    md={6}
                    lg={6}
                    className="flex items-center justify-center sm:justify-start"
                  >
                    <Image
                      src={`${import.meta.env.VITE_IMAGE_URL}/${item?.productSnapshot?.image}`}
                      alt={item?.productSnapshot?.name || 'Product Image'}
                      width={60}
                      height={60}
                      style={{
                        objectFit: 'cover',
                        borderRadius: 5,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                  </Col>

                  {/* Product Details */}
                  <Col
                    xs={24}
                    sm={12}
                    md={12}
                    lg={12}
                    className="flex flex-col justify-center sm:text-start text-center"
                  >
                    <p className="m-0 text-lg font-semibold text-[17px]">
                      {item?.productSnapshot?.name}
                    </p>
                    {item?.productSnapshot?.color && (
                      <p className="m-0 text-sm text-gray-500">
                        Color: {item?.productSnapshot?.color}
                      </p>
                    )}
                  </Col>

                  {/* Action Buttons */}
                  <Col
                    xs={24}
                    sm={24}
                    md={6}
                    lg={6}
                    className="flex flex-col items-center sm:items-end gap-2"
                  >
                    <p className="m-0 font-bold text-lg">৳ {item?.price}</p>
                    <small>Q : {item?.quantity}</small>

                    <Modal
                      title="Confirm Deletion"
                      visible={isModalVisible}
                      onOk={handleConfirmDelete}
                      onCancel={handleCancel}
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                    >
                      <p>Are you sure you want to delete this item?</p>
                    </Modal>
                  </Col>
                </Row>
              ))}
              <Divider style={{ margin: '10px' }} />
              <h4
                style={{
                  fontWeight: 'bold',
                  fontSize: '17px',
                  marginBottom: '10px',
                }}
              >
                Shipping Address
              </h4>
              <p>
                Address :
                {' ' + order?.shippingAddress?.addressLine1?.toUpperCase() ||
                  'Address not available'}
              </p>
              <p>Phone : {order?.shippingAddress?.phoneNumber}</p>
              <p>
                Date :{' '}
                {order?.createdAt
                  ? new Date(order?.shippingAddress?.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
              <Divider style={{ margin: '6px' }} />
              <h4
                style={{
                  fontWeight: 'bold',
                  fontSize: '17px',
                  marginBottom: '10px',
                }}
              >
                Billing Address
              </h4>
              <p>
                Address :
                {' ' + order?.shippingAddress?.addressLine1.toUpperCase() ||
                  'Address not available'}
              </p>
              <p>Phone : {order?.billingAddress?.phoneNumber}</p>
              <p>
                Date :{' '}
                {order?.createdAt
                  ? new Date(order?.createdAt).toLocaleString()
                  : 'N/A'}
              </p>
              <Divider style={{ margin: '10px' }} />
              <div>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} className="space-y-4 w-full">
                    {[
                      {
                        label: 'Payment :',
                        value: order?.paymentStatus
                          ? order?.paymentStatus.toUpperCase()
                          : 'N/A',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap justify-between items-center w-full space-y-2 md:space-y-0"
                      >
                        <p className="m-0 font-semibold text-left w-full md:w-1/3">
                          {item.label}
                        </p>
                        <p className="m-0 text-right w-full md:w-2/3 flex items-center justify-end space-x-2">
                          <RiEditLine size={20} onClick={handleOpenModal} />
                          <span
                            className={`flex justify-around items-center px-3 py-1 mx-auto text-white  text-sm ${
                              order?.paymentStatus === 'paid'
                                ? 'bg-green-500'
                                : order?.paymentStatus === 'failed'
                                  ? 'bg-red-500'
                                  : order?.paymentStatus === 'pending'
                                    ? 'bg-yellow-500'
                                    : order?.paymentStatus === 'refunded'
                                      ? 'bg-blue-500'
                                      : 'bg-gray-500'
                            }`}
                          >
                            {item.value || 'N/A'}
                          </span>
                        </p>
                      </div>
                    ))}
                  </Col>
                </Row>

                {/* Modal */}
                <Modal
                  title="Edit Order Information"
                  visible={isModalOpen}
                  onCancel={handleCloseModal}
                  onOk={handleUpdatePayment}
                  okText="Save"
                  cancelText="Cancel"
                >
                  <div className="space-y-4">
                    {/* Status Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <Select
                        value={status}
                        onChange={(value) => setStatus(value)}
                        className="w-full"
                      >
                        <Option value="paid">PAID</Option>
                        <Option value="failed">FAILED</Option>
                        <Option value="pending">PENDING</Option>
                        <Option value="refunded">REFUNDED</Option>
                      </Select>
                    </div>

                    {/* Details Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Details
                      </label>
                      <Input.TextArea
                        rows={4}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Enter details about the status"
                      />
                    </div>
                  </div>
                </Modal>
              </div>
              <Row justify="space-between" className="mt-4">
                <Col>Subtotal</Col>
                <Col>৳ {order?.subtotal}</Col>
              </Row>
              <Row justify="space-between">
                <Col>Shipping Fee</Col>
                <Col>৳ {order?.shipping}</Col>
              </Row>
              <Divider />
              <Row justify="space-between">
                <Col>
                  <strong>Total</strong>
                </Col>
                <Col>
                  <strong>৳ {order?.total}</strong>
                </Col>
              </Row>
            </Card>
          </div>
        </Card>

        {/* Right Section */}
        <div className="space-y-0 max-w-sm">
          {/* Update Section */}
          <Col xs={24}>
            <Card className="p-2 lg:p-0">
              <h3 className="font-bold text-xl my-3">Update Status</h3>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full"
                    options={[
                      {
                        label: 'Processing',
                        value: 5,
                      },
                      { label: 'Received', value: 6 },
                      { label: 'Canceled', value: 7 },
                      { label: 'Refunded', value: 8 },
                      { label: 'Delivered', value: 9 },
                    ]}
                  />
                </Col>
                <Col span={24}>
                  <Input
                    placeholder="Enter title..."
                    className="w-full"
                    value={statusTitle}
                    onChange={(e) => setStatusTitle(e.target.value)}
                  />
                </Col>

                <Col span={24}>
                  <TextArea
                    rows={4}
                    value={statusNote}
                    onChange={handleStatusNoteChange}
                    placeholder="Enter status note..."
                    className="w-full"
                  />
                </Col>
                <Col span={24} className="text-right">
                  <Button type="primary" onClick={handleUpdate}>
                    Update
                  </Button>
                </Col>
              </Row>
              <h3 className="font-bold text-xl mb-4">Order Details</h3>
              <Divider style={{ margin: '10px' }} />
              <Steps current={4} direction="vertical" size="small">
                {orderhistory?.map((history: any) => (
                  <Step
                    key={history?.id}
                    title={
                      <>
                        <p className="font-semibold m-0">{history?.title}</p>
                        <p className="font-sm mt-1">{history?.note}</p>
                      </>
                    }
                    description={new Date(history?.createdAt).toLocaleString()}
                    icon={
                      <div
                        style={{
                          backgroundColor: '#5600FF',
                          borderRadius: '50%',
                          padding: '12px',
                        }}
                      />
                    }
                  />
                ))}
              </Steps>
            </Card>
          </Col>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
