import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  useTheme, 
  useMediaQuery,
  Divider
} from '@mui/material';
import { useFinancialRecords } from '../../contexts/financial-record-context';
import { CategoryBreakdown } from './category-breakdown';
import { MonthlyTrends } from './monthly-trends';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 2 }, pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const { records } = useFinancialRecords();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate total income, expenses, and balance
  const financialSummary = useMemo(() => {
    const income = records
      .filter(record => record.amount > 0)
      .reduce((sum, record) => sum + record.amount, 0);
    
    const expenses = records
      .filter(record => record.amount < 0)
      .reduce((sum, record) => sum + Math.abs(record.amount), 0);
    
    const balance = income - expenses;
    
    return { income, expenses, balance };
  }, [records]);

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
        Financial Reports
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: '#e3f2fd', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                ${financialSummary.income.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: '#ffebee', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                ${financialSummary.expenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            bgcolor: '#e8f5e9', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}>
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                ${financialSummary.balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Report Tabs */}
      <Paper sx={{ 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.95rem',
              }
            }}
          >
            <Tab 
              icon={<AssessmentIcon />} 
              iconPosition="start" 
              label="Category Breakdown" 
              id="reports-tab-0" 
              aria-controls="reports-tabpanel-0" 
            />
            <Tab 
              icon={<TimelineIcon />} 
              iconPosition="start" 
              label="Monthly Trends" 
              id="reports-tab-1" 
              aria-controls="reports-tabpanel-1" 
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <CategoryBreakdown records={records} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <MonthlyTrends records={records} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Reports;