import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { FinancialRecord } from '../../contexts/financial-record-context';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

interface MonthlyTrendsProps {
  records: FinancialRecord[];
}

export const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ records }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Process data for monthly trends
  const monthlyData = useMemo(() => {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Initialize data structure for all months
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      name: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' }),
      income: 0,
      expenses: 0,
      balance: 0
    }));
    
    // Fill in data from records
    records.forEach(record => {
      const recordDate = new Date(record.date);
      const recordYear = recordDate.getFullYear();
      
      // Only include records from current year
      if (recordYear === currentYear) {
        const monthIndex = recordDate.getMonth();
        const amount = record.amount;
        
        if (amount > 0) {
          months[monthIndex].income += amount;
        } else {
          months[monthIndex].expenses += Math.abs(amount);
        }
      }
    });
    
    // Calculate balance for each month
    months.forEach(month => {
      month.balance = month.income - month.expenses;
    });
    
    return months;
  }, [records]);
  
  // Extract data for charts
  const chartMonths = monthlyData.map(d => d.name);
  const incomeData = monthlyData.map(d => d.income);
  const expenseData = monthlyData.map(d => d.expenses);
  const balanceData = monthlyData.map(d => d.balance);
  
  if (records.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No transaction data available. Add some transactions to see your monthly trends.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {/* Income vs Expenses Bar Chart */}
      <Grid item xs={12}>
        <Paper sx={{ 
          p: 2, 
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" gutterBottom>
            Income vs Expenses by Month
          </Typography>
          
          <Box sx={{ 
            height: 350, 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <BarChart
              xAxis={[{ 
                scaleType: 'band', 
                data: chartMonths,
                tickLabelStyle: {
                  angle: isMobile ? 45 : 0,
                  textAnchor: isMobile ? 'start' : 'middle',
                  fontSize: 12,
                }
              }]}
              series={[
                { data: incomeData, label: 'Income', color: '#4caf50' },
                { data: expenseData, label: 'Expenses', color: '#f44336' }
              ]}
              height={350}
              width={isMobile ? 350 : 800}
              margin={{ 
                left: 40, 
                right: 40, 
                top: 20, 
                bottom: isMobile ? 50 : 30 
              }}
            />
          </Box>
        </Paper>
      </Grid>
      
      {/* Balance Trend Line Chart */}
      <Grid item xs={12}>
        <Paper sx={{ 
          p: 2, 
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" gutterBottom>
            Monthly Balance Trend
          </Typography>
          
          <Box sx={{ 
            height: 300, 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <LineChart
              xAxis={[{ 
                scaleType: 'point', 
                data: chartMonths,
                tickLabelStyle: {
                  angle: isMobile ? 45 : 0,
                  textAnchor: isMobile ? 'start' : 'middle',
                  fontSize: 12,
                }
              }]}
              series={[
                { 
                  data: balanceData, 
                  label: 'Balance',
                  color: '#3498db',
                  area: true,
                  showMark: true,
                }
              ]}
              height={300}
              width={isMobile ? 350 : 800}
              margin={{ 
                left: 40, 
                right: 40, 
                top: 20, 
                bottom: isMobile ? 50 : 30 
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};