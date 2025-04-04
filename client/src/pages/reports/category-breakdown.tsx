import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  useTheme, 
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { FinancialRecord } from '../../contexts/financial-record-context';
import { PieChart } from '@mui/x-charts/PieChart';
import { Pie } from '@mui/x-charts/PieChart';

interface CategoryBreakdownProps {
  records: FinancialRecord[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ records }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Process data for category breakdown
  const categoryData = useMemo(() => {
    // Only include expenses (negative amounts)
    const expenseRecords = records.filter(record => record.amount < 0);
    
    // Group by category and sum amounts
    const categoryMap = expenseRecords.reduce((acc, record) => {
      const category = record.category || 'Uncategorized';
      const amount = Math.abs(record.amount);
      
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      
      acc[category].total += amount;
      acc[category].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);
    
    // Convert to array and sort by total amount
    const result = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: 0 // Will be calculated below
    }));
    
    // Calculate percentages
    const totalExpenses = result.reduce((sum, item) => sum + item.total, 0);
    result.forEach(item => {
      item.percentage = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
    });
    
    return result.sort((a, b) => b.total - a.total);
  }, [records]);
  
  // Prepare data for pie chart
  const pieChartData = useMemo(() => {
    // Take top 5 categories, group the rest as "Other"
    const topCategories = categoryData.slice(0, 5);
    const otherCategories = categoryData.slice(5);
    
    const chartData = topCategories.map((item, index) => ({
      id: index,
      value: item.total,
      label: item.category,
    }));
    
    // Add "Other" category if there are more than 5 categories
    if (otherCategories.length > 0) {
      const otherTotal = otherCategories.reduce((sum, item) => sum + item.total, 0);
      chartData.push({
        id: chartData.length,
        value: otherTotal,
        label: 'Other',
      });
    }
    
    return chartData;
  }, [categoryData]);
  
  // Generate colors for the pie chart
  const pieChartColors = [
    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400', '#34495e'
  ];
  
  if (records.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No transaction data available. Add some transactions to see your spending breakdown.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={3}>
      {/* Pie Chart */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start' }}>
            Expense Distribution
          </Typography>
          
          {pieChartData.length > 0 ? (
            <Box sx={{ 
              width: '100%', 
              height: 300,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: 30,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                height={300}
                width={isMobile ? 280 : 400}
                colors={pieChartColors}
                slotProps={{
                  legend: { hidden: true }
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ my: 4 }}>
              No expense data to display
            </Typography>
          )}
        </Paper>
      </Grid>
      
      {/* Category Table */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ 
          height: '100%',
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0'
        }}>
          <TableContainer sx={{ maxHeight: 350, overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryData.map((category, index) => (
                  <TableRow key={category.category} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: pieChartColors[index % pieChartColors.length],
                            mr: 1,
                          }}
                        />
                        {category.category}
                      </Box>
                    </TableCell>
                    <TableCell align="right">${category.total.toFixed(2)}</TableCell>
                    <TableCell align="right">{category.percentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};