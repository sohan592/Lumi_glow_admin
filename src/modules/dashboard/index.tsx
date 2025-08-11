import {
  CalendarOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Card, Descriptions, Statistic, Tooltip, Spin, Alert } from 'antd';
import { useGetCheckoutStatsQuery } from '@/modules/appstore/dashbord/dashbordApi';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { format, subMonths } from 'date-fns';

const colorPalette = {
  gradients: {
    todaySales: 'bg-gradient-to-r from-teal-500 to-teal-600',
    yesterdaySales: 'bg-gradient-to-r from-orange-500 to-orange-600',
    thisMonthSales: 'bg-gradient-to-r from-blue-500 to-blue-600',
    lastMonthSales: 'bg-gradient-to-r from-purple-500 to-purple-600',
    allTimeSales: 'bg-gradient-to-r from-green-500 to-green-600',
  } as Record<
    | 'todaySales'
    | 'yesterdaySales'
    | 'thisMonthSales'
    | 'lastMonthSales'
    | 'allTimeSales',
    string
  >,
  orderStatus: {
    pending: '#FF9F1C',
    processing: '#2EC4B6',
    delivered: '#4CAF50',
  },
  weeklySales: '#6A5ACD',
  pieChartColors: ['#FF6384', '#36A2EB', '#FFCE56'],
};

const renderCustomizedLabel = ({
  name,
  percent,
}: {
  name: string;
  percent: number;
}) => `${name} (${(percent * 100).toFixed(0)}%)`;

const SalesDashboard = () => {
  const { data, isLoading, isError } = useGetCheckoutStatsQuery('');

  // Default weekly sales data if no data is available
  const today = new Date();
  const defaultWeeklySales = [
    { date: format(subMonths(today, 1), 'yyyy-MM-dd') }, // Last month's same day
    { date: format(subMonths(today, 1), 'yyyy-MM-dd') },
    { date: format(subMonths(today, 1), 'yyyy-MM-dd') },
    { date: format(subMonths(today, 1), 'yyyy-MM-dd') },
    { date: format(today, 'yyyy-MM-dd') }, // Current date
    { date: format(today, 'yyyy-MM-dd') },
    { date: format(today, 'yyyy-MM-dd') },
  ];

  const pieColors = ['#FF6384', '#36A2EB', '#FFCE56'];

  // Use the default data if `weeklySales` is not available
  const weeklySales = data?.weeklySales?.length
    ? data.weeklySales
    : defaultWeeklySales;
  const bestSellers = data?.top3ProductsLast3Months?.length
    ? data.top3ProductsLast3Months.map((item: any, index: number) => {
        return {
          name: item?.productSnapshot?.name?.slice(0, 10),
          value: 100,
          color: pieColors[index],
        };
      })
    : [];

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" tip="Loading..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <Alert
          message="Error"
          description="There was an error fetching the data."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 lg:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sales Dashboard</h1>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {[
          {
            title: 'Today Sales',
            value: data?.todaySales,
            gradient: 'todaySales',
            icon: <ShoppingCartOutlined />,
          },
          {
            title: 'Yesterday Sales',
            value: data?.yesterdaySales,
            gradient: 'yesterdaySales',
            icon: <CalendarOutlined />,
          },
          {
            title: 'This Month Sales',
            value: data?.thisMonthSales,
            gradient: 'thisMonthSales',
            icon: <CalendarOutlined />,
          },
          {
            title: 'Last Month Sales',
            value: data?.lastMonthSales,
            gradient: 'lastMonthSales',
            icon: <CalendarOutlined />,
          },
          {
            title: 'All-Time Sales',
            value: data?.allTimeSales,
            gradient: 'allTimeSales',
            icon: <LineChartOutlined />,
          },
        ].map((card, index) => (
          <Card
            key={index}
            className={`${colorPalette.gradients[card.gradient as keyof typeof colorPalette.gradients]} text-white rounded-xl shadow-lg transform transition hover:scale-105 duration-300`}
          >
            <Statistic
              title={
                <span className="flex items-center text-white opacity-90">
                  {card.icon}
                  <span className="ml-2">{card.title}</span>
                </span>
              }
              value={card.value || 0}
              valueStyle={{ color: '#fff' }}
              suffix="৳"
            />
          </Card>
        ))}
      </div>

      {/* Order Statuses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-xl shadow-lg">
          <Descriptions
            title={
              <div className="flex items-center">
                <ShoppingCartOutlined className="mr-2 text-blue-600" />
                Order Statuses
              </div>
            }
            layout="vertical"
            bordered
          >
            {[
              { label: 'Total Orders', value: data?.totalOrders },
              {
                label: 'Orders Pending',
                value: data?.ordersPending,
                color: colorPalette.orderStatus.pending,
              },
              {
                label: 'Orders Processing',
                value: data?.ordersProcessing,
                color: colorPalette.orderStatus.processing,
              },
              {
                label: 'Orders Delivered',
                value: data?.ordersDelivered,
                color: colorPalette.orderStatus.delivered,
              },
            ].map((status, index) => (
              <Descriptions.Item
                key={index}
                label={status.label}
                labelStyle={{ fontWeight: 'bold', color: status.color }}
              >
                <Tooltip title={`${status.label}: ${status.value || 0}`}>
                  <span style={{ color: status.color }}>
                    {status.value || 0}
                  </span>
                </Tooltip>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>

        {/* Weekly Sales */}
        <Card className="rounded-xl shadow-lg">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Weekly Sales Trend
            </h2>
            <ResponsiveContainer height={300}>
              <BarChart data={weeklySales}>
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="sales" fill={colorPalette.weeklySales} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Best Selling Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8 p-2 lg:p-0">
        <Card className="rounded-xl shadow-lg">
          <div className="h-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Best Selling Products
            </h2>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={bestSellers}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={renderCustomizedLabel}
                  paddingAngle={5}
                >
                  {bestSellers.map((_: any, index: any) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        colorPalette.pieChartColors[
                          index % colorPalette.pieChartColors.length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="col-span-1 flex flex-col gap-4 p-2 lg:p-6">
          {bestSellers &&
            bestSellers.length > 0 &&
            bestSellers.map((product: any, index: any) => (
              <Card
                key={index}
                className="rounded-xl shadow-lg flex items-center hover:bg-gray-100 transition duration-300"
              >
                <ShoppingOutlined
                  className="text-4xl mr-4"
                  style={{
                    color:
                      colorPalette.pieChartColors[
                        index % colorPalette.pieChartColors.length
                      ],
                  }}
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">Sales: {product.value || 0}</p>{' '}
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
