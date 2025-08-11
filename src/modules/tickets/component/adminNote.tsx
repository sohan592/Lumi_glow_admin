import { Card, Form, Input, Button, message } from 'antd';

const NoteSubmissionForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Reply submitted:', values);
    form.resetFields();
    message.success('Note submitted successfully');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <Card
        className="mt-6 shadow-lg rounded-lg border-none"
        bodyStyle={{ padding: '2rem' }}
      >
        <Form
          form={form}
          name="reply-form"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          {/* Reply Field */}
          <Form.Item
            name="adminNote"
            label={
              <span className="font-semibold text-gray-700">Admin Note</span>
            }
            rules={[{ required: true, message: 'Reply is required' }]}
          >
            <Input.TextArea
              placeholder="Enter your note here"
              rows={4}
              className="rounded-md"
            />
          </Form.Item>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="primary" htmlType="submit">
              Submit Note
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NoteSubmissionForm;
