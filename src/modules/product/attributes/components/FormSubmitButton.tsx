import { useEffect, useState } from 'react';

import { Form, type FormInstance } from 'antd';
import ButtonComponent from '@/@components/form/button';

interface SubmitButtonProps {
  form: FormInstance;
  onClick: () => void;
  loading?: boolean;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  onClick,
  children,
  loading,
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <ButtonComponent
      type="primary"
      borderRadius="4px"
      onClick={onClick}
      htmlType="submit"
      disabled={!submittable}
      loading={loading}
    >
      {children}
    </ButtonComponent>
  );
};

export default SubmitButton;
