import { RiArrowUpDownLine, RiMenu3Line, RiSearchLine } from '@remixicon/react';
import { Col, Input, Row, Space } from 'antd';
import { useState } from 'react';
import DropDownComponent from '../dropdown';
import { default as Button, default as ButtonComponent } from '../form/button';
import { TableMenuItems } from './TableMenu';

interface TableHeaderProps {
  isSearchAndFilterOpen: boolean;
  setSearchAndFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownItems?: any;
  dataSource: any;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  setFilterStatus?: React.Dispatch<React.SetStateAction<string | null>>;
  searchPlaceholder?: string;
  leftHeaderComponent?: React.ReactNode;
}

export function TableHeader({
  isSearchAndFilterOpen,
  setSearchAndFilterOpen,
  dropdownItems,
  dataSource,
  setKeyword,
  searchPlaceholder,
  setFilterStatus,
  leftHeaderComponent,
}: TableHeaderProps) {
  const emptyData = dataSource.length === 0;

  const [tempSearchKeywordData, setTempSearchKeywordData] = useState('');
  return (
    <Row className="flex-col sm:flex-row gap-4 sm:gap-2">
      {/* Left Column */}
      <Col className="w-full sm:flex-1">
        {isSearchAndFilterOpen ? (
          <Col className="space-y-4">
            <Col>
              <Input
                size="middle"
                width="100%"
                placeholder={searchPlaceholder}
                prefix={<RiSearchLine color="var(--neutrals-500)" size={18} />}
                onChange={(e) => {
                  setTempSearchKeywordData(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setKeyword(tempSearchKeywordData);
                  }
                }}
                onClear={() => {
                  setTempSearchKeywordData('');
                  setKeyword('');
                }}
                allowClear
              />
            </Col>
          </Col>
        ) : setFilterStatus && !leftHeaderComponent ? (
          <TableMenuItems
            dataSource={dataSource}
            setFilterStatus={setFilterStatus}
          />
        ) : leftHeaderComponent ? (
          leftHeaderComponent
        ) : null}
      </Col>

      {/* Right Column */}
      <Col className="w-full sm:w-auto min-w-[220px]">
        <Row gutter={[8, 8]} className="justify-between sm:justify-end">
          {isSearchAndFilterOpen ? (
            <Col className="w-full">
              <Row gutter={[8, 8]} className="flex-col sm:flex-row">
                <Col className="w-full sm:w-1/2">
                  <Button
                    type="text"
                    onClick={() => {
                      setSearchAndFilterOpen(false);
                      setKeyword('');
                      setTempSearchKeywordData('');
                    }}
                    className="w-full py-2"
                  >
                    Cancel
                  </Button>
                </Col>
                <Col className="w-full sm:w-1/2">
                  <Button
                    type={
                      tempSearchKeywordData && tempSearchKeywordData !== ''
                        ? 'default'
                        : undefined
                    }
                    disabled={
                      tempSearchKeywordData && tempSearchKeywordData !== ''
                        ? false
                        : true
                    }
                    className="w-full py-2"
                    onClick={() => {
                      setKeyword(tempSearchKeywordData);
                    }}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Col>
          ) : (
            <Col>
              <Button
                type="default"
                disabled={emptyData}
                icon={
                  <Space>
                    <RiSearchLine size={18} style={{ marginRight: '4px' }} />
                    <RiMenu3Line size={18} />
                  </Space>
                }
                style={{ width: '100%', padding: '0 8px' }}
                onClick={() => setSearchAndFilterOpen(true)}
              />
            </Col>
          )}

          <Col className="w-auto">
            {dropdownItems && dropdownItems.length > 0 ? (
              <DropDownComponent items={dropdownItems} disabled={emptyData}>
                <ButtonComponent
                  type="default"
                  icon={<RiArrowUpDownLine size={18} />}
                  className="p-2 w-full sm:w-auto"
                />
              </DropDownComponent>
            ) : null}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
