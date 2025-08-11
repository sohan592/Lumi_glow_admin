export type menuCollapseType = {
  showDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};
export type BreadcrumbHeaderProps = {
  breadcrumbItems?: { title: string; url?: string }[];
  pageTitle?: string;
  leftSideComponent?: React.ReactNode;
  showBreadcrumb?: boolean;
  showPageTitle?: boolean;
  children?: React.ReactNode;
};
