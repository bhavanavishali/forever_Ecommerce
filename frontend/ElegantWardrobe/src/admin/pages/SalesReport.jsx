import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  FileText,
  Download,
  Loader,
} from "lucide-react";
import api, { adminApi } from "@/api";
import { ShopContext } from "@/context/ShopContext";

const SalesReport = () => {
  const { currency } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState("daily");
  const [customRange, setCustomRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isChange,setIsChange] = useState(false)

  // Load initial report data
  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    console.log('dateRange',dateRange);
    
    setLoading(true);
    try {
      let url = `/sales-report/?date_range=${dateRange}`;

      if (dateRange === "custom") {
        url += `&start_date=${customRange.startDate}&end_date=${customRange.endDate}`;
      }

      const response = await adminApi.get(url);
      console.log(response.data);
      
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
      alert("Failed to load sales report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    setLoading(true);
    try {
      let url = `/sales-report/?date_range=${dateRange}&download_format=${format}`;

      if (dateRange === "custom") {
        url += `&start_date=${customRange.startDate}&end_date=${customRange.endDate}`;
      }

      const response = await adminApi.get(url, { responseType: "blob" });

      // Create blob link to download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `sales_report_${format}.${format === "excel" ? "xlsx" : "pdf"}`
      );

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(`Error downloading ${format} report:`, error);
      alert(`Failed to download ${format} report. Please try again.`);
    } finally {
      setLoading(false);
      setShowDownloadOptions(false);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!reportData || !reportData.orders || reportData.orders.length === 0)
      return [];

    const ordersByDate = {};

    reportData.orders.forEach((order) => {
      const date = order.order_date;
      if (!ordersByDate[date]) {
        ordersByDate[date] = {
          date,
          sales: 0,
          orders: 0,
          discount: 0,
        };
      }
      ordersByDate[date].sales += order.total;
      ordersByDate[date].orders += 1;
    });

    // Add discount data
    if (reportData.discount_details) {
      reportData.discount_details.forEach((discount) => {
        const order = reportData.orders.find(
          (o) => o.order_no === discount.order_no
        );
        if (order) {
          const date = order.order_date;
          if (ordersByDate[date]) {
            ordersByDate[date].discount += discount.discount_amount;
          }
        }
      });
    }

    return Object.values(ordersByDate);
  };

  const handleDateRangeChange = (newRange) => {
    
    setDateRange(newRange);
    setShowDateFilter(false);
  };

  const handleCustomRangeSubmit = () => {
    if (new Date(customRange.startDate) > new Date(customRange.endDate)) {
      alert("Start date cannot be after end date");
      return;
    }

    fetchReport();
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Calendar size={16} />
                  <span>
                    {dateRange === "daily" && "Today"}
                    {dateRange === "weekly" && "This Week"}
                    {dateRange === "monthly" && "This Month"}
                    {dateRange === "yearly" && "This Year"}
                    {dateRange === "custom" && "Custom Range"}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {showDateFilter && (
                  <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="py-1">
                      <button
                        onClick={() => handleDateRangeChange("daily")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => handleDateRangeChange("weekly")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        This Week
                      </button>
                      <button
                        onClick={() => handleDateRangeChange("monthly")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        This Month
                      </button>
                      <button
                        onClick={() => handleDateRangeChange("yearly")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        This Year
                      </button>
                      <button
                        onClick={() => handleDateRangeChange("custom")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Custom Range
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {dateRange === "custom" && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="date"
                    value={customRange.startDate}
                    onChange={(e) =>
                      setCustomRange({
                        ...customRange,
                        startDate: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={customRange.endDate}
                    onChange={(e) =>
                      setCustomRange({
                        ...customRange,
                        endDate: e.target.value,
                      })
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    onClick={handleCustomRangeSubmit}
                    className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="flex items-center space-x-2 bg-black text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Download size={16} />
                <span>Download Report</span>
                <ChevronDown size={16} />
              </button>

              {showDownloadOptions && (
                <div className="absolute right-0 z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={() => handleDownload("pdf")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FileText size={16} className="mr-2" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => handleDownload("excel")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <FileText size={16} className="mr-2" />
                      <span>Excel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size={48} className="animate-spin text-black" />
          </div>
        ) : reportData ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-sm font-medium text-gray-500 mb-1">
                  Total Orders
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {reportData?.summary?.total_orders}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-sm font-medium text-gray-500 mb-1">
                  Total Sales
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {currency} {reportData?.summary?.total_sales?.toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-sm font-medium text-gray-500 mb-1">
                  Total Discount
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                {currency} {reportData?.summary?.total_discount?.toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-sm font-medium text-gray-500 mb-1">
                  Net Sales
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {currency} {reportData?.summary?.net_sales?.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Charts */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Sales']} />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders vs. Discount</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#4f46e5" />
                      <Bar yAxisId="right" dataKey="discount" name="Discount ($)" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div> */}

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Details
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Payment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData?.orders?.length > 0 ? (
                      reportData?.orders?.map((order, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order?.order_no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order?.order_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order?.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                order?.status === "DELIVERED"
                                  ? "bg-green-100 text-green-800"
                                  : order?.status === "SHIPPED"
                                  ? "bg-blue-100 text-blue-800"
                                  : order?.status === "CONFIRMED"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order?.payment_method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {currency} {order?.total.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                        >
                          No orders found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discounts Table */}
            {reportData?.discount_details &&
              reportData?.discount_details?.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Discount Details
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Coupon Code
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Discount %
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Discount Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.discount_details.map((discount, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {discount.order_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {discount.coupon_code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {discount.discount_percent}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{/**/}
                              {currency} {discount.discount_amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">
              No report data available. Please select a date range and generate
              a report.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
