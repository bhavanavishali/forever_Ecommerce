"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useContext, useEffect, useState } from "react"
import { ShopContext } from "@/context/ShopContext"
import api, { adminApi } from "@/api"

// Sample data matching your backend structure for categories
const sampleData = [
  {
    category_id: 1,
    category_name: "T-Shirts",
    total_quantity_sold: 850,
    total_revenue: 42500,
  },
  {
    category_id: 2,
    category_name: "Formal Shirts",
    total_quantity_sold: 620,
    total_revenue: 37200,
  },
  {
    category_id: 3,
    category_name: "Casual Wear",
    total_quantity_sold: 480,
    total_revenue: 28800,
  },
  {
    category_id: 4,
    category_name: "Sports Wear",
    total_quantity_sold: 350,
    total_revenue: 21000,
  },
  {
    category_id: 5,
    category_name: "Accessories",
    total_quantity_sold: 280,
    total_revenue: 16800,
  },
  {
    category_id: 6,
    category_name: "Footwear",
    total_quantity_sold: 220,
    total_revenue: 13200,
  },
]

// Color palette for the chart segments
const COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#f59e0b", // Orange
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#f97316", // Orange-red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#ec4899", // Pink
  "#6366f1", // Indigo
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.category_name}</p>
        <p className="text-sm text-gray-600">
          Quantity Sold: <span className="font-medium">{data.total_quantity_sold}</span>
        </p>
        <p className="text-sm text-gray-600">
          Revenue: <span className="font-medium">${data.total_revenue?.toLocaleString()}</span>
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ data }) => {
  return (
    <div className="flex flex-col space-y-2 mt-4 lg:mt-0">
      {data?.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }} />
          <span className="text-sm text-gray-700">{item.category_name}</span>
        </div>
      ))}
    </div>
  )
}

export default function BestSellingCategories() {
     const [data,setData] = useState([])
  const {currency} = useContext(ShopContext)

  useEffect(()=>{
    const getProductData = async()=>{
      try {
        const res = await adminApi.get('/best_selling_categories/')
        setData(res.data);
        
      } catch (error) {
        console.log(error.message);
        
      }
    }
    getProductData()
  },[])
  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    ...item,
    value: item.total_quantity_sold,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 text-center lg:text-left">
            Top Selling Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Category Distribution</h3>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4 text-center lg:text-left">Categories</h4>
                <CustomLegend data={chartData} />
              </div>
            </div>
          </div>

          {/* Stats Table for Mobile */}
          <div className="mt-6 lg:hidden">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Category Statistics</h4>
              <div className="space-y-3">
                {data.map((category, index) => (
                  <div
                    key={category.category_id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-medium">{category.category_name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{category.total_quantity_sold}</div>
                      <div className="text-xs text-gray-600">${category.total_revenue?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Stats Table */}
          <div className="hidden lg:block mt-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Quantity Sold</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Revenue</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((category, index) => {
                    const totalQuantity = data.reduce((sum, item) => sum + item.total_quantity_sold, 0)
                    const percentage = ((category.total_quantity_sold / totalQuantity) * 100).toFixed(1)

                    return (
                      <tr key={category.category_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-sm"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{category.category_name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold">{category.total_quantity_sold}</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          {currency}{category.total_revenue?.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-semibold">{percentage}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
