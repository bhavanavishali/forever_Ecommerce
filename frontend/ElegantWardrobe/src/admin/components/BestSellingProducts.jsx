"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api, { adminApi } from "@/api"
import { useContext, useEffect, useState } from "react"
import { ShopContext } from "@/context/ShopContext"


// Color palette for the chart segments
const COLORS = [
  "#ef4444", // Red for nike t-shirt
  "#3b82f6", // Blue for memo formal shirt
  "#f59e0b", // Orange for METRONAUT
  "#10b981", // Green for HRX
  "#8b5cf6", // Purple for INDCLUB
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.product_name}</p>
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
          <span className="text-sm text-gray-700 capitalize">{item.product_name}</span>
        </div>
      ))}
    </div>
  )
}

export default function BestSellingProducts() {

  const [data,setData] = useState([])
  const {currency} = useContext(ShopContext)

  useEffect(()=>{
    const getProductData = async()=>{
      try {
        const res = await adminApi.get('/best_selling_products/')
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
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Product Distribution</h3>
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
                <h4 className="font-semibold text-gray-800 mb-4 text-center lg:text-left">Products</h4>
                <CustomLegend data={chartData} />
              </div>
            </div>
          </div>

          {/* Stats Table for Mobile */}
          <div className="mt-6 lg:hidden">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Product Statistics</h4>
              <div className="space-y-3">
                {data.map((product, index) => {
                  return(
                  <div
                    key={product.product_id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-medium capitalize">{product.product_name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{product.total_quantity_sold}</div>
                      <div className="text-xs text-gray-600">{currency}{product.total_revenue?.toLocaleString()}</div>
                    </div>
                  </div>
                  )
                  })}
              </div>
            </div>
          </div>

          {/* Desktop Stats Table */}
          <div className="hidden lg:block mt-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Product</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Quantity Sold</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Revenue</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-800">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product, index) => {
                  const totalQuantity = data.reduce((sum, item) => sum + item.total_quantity_sold, 0)
                  const percentage = ((product.total_quantity_sold / totalQuantity) * 100).toFixed(1)
                    return (
                    <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium capitalize">{product.product_name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">{product.total_quantity_sold}</td>
                      <td className="text-right py-3 px-4 font-semibold">{currency} {product.total_revenue?.toLocaleString()}</td>                      
                      <td className="text-right py-3 px-4 font-semibold">{percentage} %</td>                      

                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
