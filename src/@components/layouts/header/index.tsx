import { menuCollapseType } from '@/types/layout';
import { getBreakpoint } from '@/utils/helpers';
import { RiMenuLine } from '@remixicon/react';
import { Header } from 'antd/es/layout/layout';
import ProfileAvatar from './components/avatar';

const HeaderNav = ({ showDrawer }: menuCollapseType) => {
  const screenSize = getBreakpoint();
  return (
    <Header
      className="private-layout-header"
      style={{
        background: 'var(--white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        zIndex: 1,
        padding: '0px 26px',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {['md', 'sm', 'xs'].includes(screenSize) && (
          <RiMenuLine
            size={32}
            onClick={() => showDrawer(true)}
            style={{ marginRight: 'var(--margin-sm)', cursor: 'pointer' }}
          />
        )}
      </div>
      <div className="header_right_side">
        <ProfileAvatar />
      </div>
    </Header>
  );
};

export default HeaderNav;
