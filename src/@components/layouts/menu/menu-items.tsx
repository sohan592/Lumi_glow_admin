import { Menu } from 'antd';
import { MenuProps } from 'antd/lib';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  RiCouponLine,
  RiGalleryLine,
  RiHomeSmile2Line,
  RiNewspaperLine,
  RiShipLine,
  RiStackLine,
  RiStarHalfLine,
  RiUserLine,
} from '@remixicon/react';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/',
    label: 'Dashboard',
    icon: <RiHomeSmile2Line size={18} />,
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: <RiStackLine size={18} />,
    children: [
      {
        key: 'all-orders',
        label: 'All Orders',
      },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    icon: <RiNewspaperLine size={18} />,
    children: [
      {
        key: '',
        label: 'All Products',
      },
      {
        key: 'categories',
        label: 'Categories',
      },
      // {
      //   key: 'attributes',
      //   label: 'Attributes',
      // },
      {
        key: 'tags',
        label: 'Tags',
      },
      {
        key: 'brands',
        label: 'Brands',
      },
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: <RiStarHalfLine size={18} />,
  },
  {
    key: 'coupons',
    label: 'Coupons',
    icon: <RiCouponLine size={18} />,
  },

  {
    key: 'shipping-methods',
    label: 'Shipping Methods ',
    icon: <RiShipLine size={18} />,
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: <RiUserLine size={18} />,
  },

  {
    key: 'medias',
    label: 'Medias',
    icon: <RiGalleryLine size={18} />,
  },
  // {
  //   key: 'tickets',
  //   label: 'Tickets',
  //   icon: <RiTicketLine size={18} />,
  // },
  // {
  //   key: 'detect',
  //   label: 'Detect',
  //   icon: <RiCamera3Line size={18} />,
  // },
];

const MenuItems = ({ collapsed }: { collapsed: boolean }) => {
  let { pathname } = useLocation();
  const pathKeys = pathname.split('/').filter(Boolean);
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    const url: string = e.keyPath.reverse().join('/');
    console.log(url);
    navigate(url);
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        maxWidth: 256,
        border: 'none',
      }}
      selectedKeys={[pathKeys.pop() || '/']}
      defaultOpenKeys={pathKeys.splice(-1) || ['/']}
      mode="inline"
      items={items}
      inlineCollapsed={collapsed}
    />
  );
};

export default MenuItems;
