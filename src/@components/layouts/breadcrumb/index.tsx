import { BreadcrumbHeaderProps } from '@/types/layout';
import { capitalize } from '@/utils/helpers';
import { Breadcrumb, Flex } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

const renderBreadcrumbItems = (pathnames: string[]) => {
  return [
    {
      title: pathnames.length === 0 ? '' : <NavLink to="/">Dashboard</NavLink>,
    },
    ...pathnames.map((pathname, index) => ({
      title:
        pathnames.length === index + 1 ? (
          capitalize(pathname)
        ) : (
          <NavLink to={`/${pathname}`}>{capitalize(pathname)}</NavLink>
        ),
    })),
  ];
};

const renderCustomBreadcrumbItems = (
  items: { title: string; url?: string }[],
) => {
  return items.map((item, _index) => ({
    title: item?.url ? (
      <NavLink to={item.url}>{item.title}</NavLink>
    ) : (
      item.title
    ),
  }));
};

const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({
  breadcrumbItems,
  pageTitle,
  leftSideComponent,
  showBreadcrumb = true,
  showPageTitle = true,
  children,
}) => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <Flex
      justify="space-between"
      align="center"
      className="breadcrumb_header flex-col sm:flex-row gap-4 sm:gap-0 w-full"
      role="banner"
      aria-label="Page header"
    >
      <div className="w-full sm:w-auto">
        {leftSideComponent ?? (
          <Fragment>
            {showPageTitle && (
              <p className="page_header_title text-lg sm:text-xl font-medium mb-2 sm:mb-0">
                {pageTitle ??
                  (pathnames.length > 0
                    ? capitalize(pathnames[pathnames.length - 1])
                    : 'Dashboard')}
              </p>
            )}
            {showBreadcrumb && (
              <div className="hidden sm:block">
                <Breadcrumb
                  items={
                    breadcrumbItems
                      ? renderCustomBreadcrumbItems(breadcrumbItems)
                      : renderBreadcrumbItems(pathnames)
                  }
                />
              </div>
            )}
          </Fragment>
        )}
      </div>
      <div className="w-full sm:w-auto flex justify-start sm:justify-end">
        {children}
      </div>
    </Flex>
  );
};

export default BreadcrumbHeader;
