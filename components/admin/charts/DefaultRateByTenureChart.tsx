'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface DefaultRateByTenureChartProps {
  data: Array<{
    tenure: string;
    defaultRate: number;
    totalLoans: number;
  }>;
}

export function DefaultRateByTenureChart({ data }: DefaultRateByTenureChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Default Rate by Loan Tenure</h2>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="tenure" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'defaultRate') return [`${value.toFixed(1)}%`, 'Default Rate'];
                return [value, 'Total Loans'];
              }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="defaultRate" 
              fill="#ef4444" 
              radius={[8, 8, 0, 0]}
              name="Default Rate (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mt-3">
        Insight: Longer tenure loans show different default patterns
      </p>
    </motion.div>
  );
}
