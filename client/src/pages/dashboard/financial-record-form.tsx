import React, { useState } from "react";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Box,
  Divider,
  Typography
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import PaymentIcon from "@mui/icons-material/Payment";

export const FinancialRecordForm = () => {
  const { addRecord } = useFinancialRecords();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    category: "",
    paymentMethod: "Cash" // Default payment method
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData({
      ...formData,
      [name]: name === "amount" ? parseFloat(value as string) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addRecord({
      date: new Date(formData.date),
      description: formData.description,
      amount: formData.amount,
      category: formData.category,
      paymentMethod: formData.paymentMethod
    });
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: 0,
      category: "",
      paymentMethod: "Cash"
    });
  };

  // Predefined categories for financial records
  const categories = [
    "Food & Dining",
    "Shopping",
    "Housing",
    "Transportation",
    "Entertainment",
    "Healthcare",
    "Personal Care",
    "Education",
    "Travel",
    "Gifts & Donations",
    "Investments",
    "Income",
    "Other"
  ];

  // Payment methods
  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Mobile Payment",
    "Check",
    "Other"
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#3498db',
                },
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this transaction for?"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#3498db',
                },
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
            helperText="Use negative values for expenses"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#3498db',
                },
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#3498db',
              },
            },
            minWidth: 200 // Adjust the minimum width
          }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              name="paymentMethod"
              value={formData.paymentMethod}
              label="Payment Method"
              onChange={handleChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300
                  },
                },
              }}
              sx={{
                '& .MuiSelect-select': {
                  paddingRight: '32px'
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <PaymentIcon />
                </InputAdornment>
              }
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#3498db',
              },
            },
          }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300
                  },
                },
              }}
              sx={{
                '& .MuiSelect-select': {
                  paddingRight: '32px'
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>
                <Typography color="text.secondary">Select Category</Typography>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<AddCircleOutlineIcon />}
            sx={{ 
              mt: 1, 
              bgcolor: '#3498db', 
              '&:hover': { bgcolor: '#2980b9' },
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Add Transaction
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};