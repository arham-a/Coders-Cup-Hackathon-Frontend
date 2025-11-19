'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface RepaymentTrendChartProps {
  data: Array<{
    month: string;
    collected: number;
    expected: number;
  }>;
}

export function RepaymentTrendChart({ data }: RepaymentTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Repayment Trend (6 Months)</h2>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value: number) => `PKR ${value.toLocaleString()}`}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="collected" 
              stroke="#f97316" 
              strokeWidth={3}
              name="Collected"
              dot={{ fill: '#f97316', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expected" 
              stroke="#9ca3af" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Expected"
              dot={{ fill: '#9ca3af', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
