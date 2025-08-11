import {
  RiNotification2Line,
  RiSettings4Line,
  RiMailLine,
  RiMessage2Line,
  RiErrorWarningLine,
} from '@remixicon/react';
import type { MenuProps } from 'antd';
import { Dropdown, Row, Badge } from 'antd';
import React from 'react';

const items: MenuProps['items'] = [
  {
    label: (
      <Row
        align="middle"
        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        gutter={8}
      >
        <RiMessage2Line className="text-blue-500" size={18} />
        <div className="flex-1">
          <p className="text-sm font-medium m-0">New Message</p>
          <p className="text-xs text-gray-500 m-0">
            John Doe sent you a message
          </p>
          <span className="text-xs text-gray-400">2 minutes ago</span>
        </div>
      </Row>
    ),
    key: '0',
  },
  {
    label: (
      <Row
        align="middle"
        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        gutter={8}
      >
        <RiMailLine className="text-green-500" size={18} />
        <div className="flex-1">
          <p className="text-sm font-medium m-0">Email Notification</p>
          <p className="text-xs text-gray-500 m-0">You have 3 new emails</p>
          <span className="text-xs text-gray-400">1 hour ago</span>
        </div>
      </Row>
    ),
    key: '1',
  },
  {
    label: (
      <Row
        align="middle"
        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        gutter={8}
      >
        <RiErrorWarningLine className="text-yellow-500" size={18} />
        <div className="flex-1">
          <p className="text-sm font-medium m-0">System Alert</p>
          <p className="text-xs text-gray-500 m-0">
            System maintenance scheduled
          </p>
          <span className="text-xs text-gray-400">2 hours ago</span>
        </div>
      </Row>
    ),
    key: '2',
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
      >
        <RiSettings4Line className="text-gray-500" size={18} />
        <span className="text-sm font-medium">Notification Settings</span>
      </Row>
    ),
    key: '3',
  },
];

const NotificationDropdown: React.FC = () => (
  <Dropdown
    menu={{ items }}
    trigger={['click']}
    placement="bottomRight"
    overlayStyle={{
      minWidth: '300px',
    }}
  >
    <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200">
      <Badge count={3} size="small">
        <RiNotification2Line
          size={20}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        />
      </Badge>
    </div>
  </Dropdown>
);

export default NotificationDropdown;
