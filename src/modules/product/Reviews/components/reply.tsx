import { useUpdateReviewMutation } from '@/modules/appstore/review/reviewApi';
import { Card, Form, Input, Button, message } from 'antd';
import { useState } from 'react';

const ReplyForm = ({ reviewData, setIsModalOpen }: any) => {
  const [form] = Form.useForm();
  const [updateReview] = useUpdateReviewMutation();
  const [adminReply, setAdminReply] = useState(reviewData?.adminReply);

  const onFinish = async () => {
    await updateReview({
      id: reviewData.id,
      updatedData: { adminReply: adminReply },
    }).then(() => {
      setIsModalOpen(false);
      message.success('Reply submitted successfully');
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <Card className="mt-6 shadow-lg rounded-lg border-none">
        <Form
          form={form}
          name="reply-form"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
          initialValues={{ adminReply: adminReply }}
        >
          {/* Reply Field */}
          <Form.Item
            name="adminReply"
            label={<span className="font-semibold text-gray-700">Reply</span>}
            rules={[{ required: true, message: 'Reply is required' }]}
          >
            <Input.TextArea
              placeholder="Enter your reply here"
              rows={4}
              className="rounded-md"
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
            />
          </Form.Item>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="primary" htmlType="button" onClick={onFinish}>
              Reply
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ReplyForm;
