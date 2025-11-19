'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { motion } from 'framer-motion';

interface IncomeVsDefaultChartProps {
  data: Array<{
    income: number;
    loanAmount: number;
    defaulted: boolean;
  }>;
}

export function IncomeVsDefaultChart({ data }: IncomeVsDefaultChartProps) {
  const defaultedData = data.filter(d => d.defaulted);
  const activeData = data.filter(d => !d.defaulted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Income vs Loan Amount Analysis</h2>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="income" 
              name="Monthly Income"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <YAxis 
              type="number" 
              dataKey="loanAmount" 
              name="Loan Amount"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <ZAxis range={[50, 200]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number, name: string) => {
                if (name === 'income') return [`PKR ${value.toLocaleString()}`, 'Monthly Income'];
                return [`PKR ${value.toLocaleString()}`, 'Loan Amount'];
              }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Scatter 
              name="Active Loans" 
              data={activeData} 
              fill="#10b981"
              opacity={0.6}
            />
            <Scatter 
              name="Defaulted Loans" 
              data={defaultedData} 
              fill="#ef4444"
              opacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Active Loans</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Defaulted Loans</span>
        </div>
      </div>
    </motion.div>
  );
}
