import {
  useGetProfileQuery,
  useSignOutMutation,
} from '@/modules/appstore/Auth/authApi';
import {
  RiArrowDownSLine,
  RiUserLine,
  RiSettings4Line,
  RiLogoutBoxLine,
  RiUserSettingsLine,
} from '@remixicon/react';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileAvatar: React.FC = () => {
  const [signOut] = useSignOutMutation();

  const { data: user } = useGetProfileQuery({});
  console.log(user);

  const items: MenuProps['items'] = [
    {
      label: (
        <Link to="/profile-settings" className="block">
          <Row
            align="middle"
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
            gutter={8}
          >
            <RiUserSettingsLine className="text-gray-500" size={18} />
            <span className="text-sm font-medium pl-2">Profile Settings</span>
          </Row>
        </Link>
      ),
      key: '0',
    },
    {
      label: (
        <Link to="/account-settings" className="block">
          {' '}
          <Row
            align="middle"
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
            gutter={8}
          >
            <RiSettings4Line className="text-gray-500" size={18} />
            <span className="text-sm font-medium pl-2">Account Settings</span>
          </Row>
        </Link>
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
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
          gutter={8}
          onClick={async () => {
            try {
              await signOut({}).unwrap();
              window.location.href = '/login';
            } catch (error) {
              console.error('Failed to sign out:', error);
            }
          }}
        >
          <RiLogoutBoxLine className="text-red-500" size={18} />
          <span className="text-sm font-medium text-red-500 pl-2">Logout</span>
        </Row>
      ),
      key: '2',
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ minWidth: '200px' }}
    >
      <Row
        align="middle"
        className="px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-all duration-200"
        gutter={8}
      >
        <Avatar
          size={40}
          icon={<RiUserLine size={20} />}
          className="bg-blue-500 flex items-center justify-center"
          alt="User Avatar"
        />
        <div className="hidden sm:block pl-2">
          <p className="text-sm font-medium text-gray-900 m-0">
            {user?.firstName + ' ' + user?.lastName}
          </p>
          <p className="text-xs text-gray-500 m-0">{user?.role?.name}</p>
        </div>
        <RiArrowDownSLine className="text-gray-400 ml-1" size={20} />
      </Row>
    </Dropdown>
  );
};

export default ProfileAvatar;
