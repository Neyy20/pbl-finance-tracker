import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TextField,
  Box,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CategoryIcon from "@mui/icons-material/Category";
import PaymentIcon from "@mui/icons-material/Payment";
import { useFinancialRecords } from "../../contexts/financial-record-context";

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Categories for dropdown
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

  const handleEdit = (record: any) => {
    setEditingId(record._id);
    setEditData({
      date: formatDate(record.date),
      description: record.description,
      amount: record.amount,
      category: record.category,
      paymentMethod: record.paymentMethod || "Cash"
    });
  };

  const handleSave = async (id: string) => {
    await updateRecord(id, {
      date: new Date(editData.date),
      description: editData.description,
      amount: parseFloat(editData.amount),
      category: editData.category,
      paymentMethod: editData.paymentMethod
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Add a check to ensure records is an array
  if (!Array.isArray(records)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading records...</Typography>
      </Box>
    );
  }

  if (records.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        p: 5,
        bgcolor: '#f9f9f9',
        borderRadius: 2,
        border: '1px dashed #ccc'
      }}>
        <Typography variant="body1" sx={{ mb: 1, color: '#7f8c8d' }}>
          No transactions found.
        </Typography>
        <Typography variant="body2" color="primary">
          Add your first transaction using the form!
        </Typography>
      </Box>
    );
  }

  // Mobile view for records
  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {records.map((record) => (
          <Card key={record._id} sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: `1px solid ${record.amount >= 0 ? '#e8f8ea' : '#f8e8e8'}`
          }}>
            <CardContent>
              {editingId === record._id ? (
                // Edit mode for mobile
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={editData.amount}
                    onChange={handleChange}
                    size="small"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={editData.category}
                      label="Category"
                      onChange={handleChange}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="paymentMethod"
                      value={editData.paymentMethod || "Cash"}
                      label="Payment Method"
                      onChange={handleChange}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      onClick={() => record._id && handleSave(record._id)}
                      color="primary"
                      size="small"
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton 
                      onClick={handleCancel}
                      color="error"
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </Stack>
              ) : (
                // View mode for mobile
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {record.description}
                    </Typography>
                    <Typography
                      sx={{ 
                        color: record.amount >= 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold'
                      }}
                    >
                      {formatCurrency(record.amount)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(record.date)}
                    </Typography>
                    <Chip 
                      label={record.category} 
                      size="small" 
                      icon={<CategoryIcon fontSize="small" />}
                      sx={{ 
                        bgcolor: record.amount >= 0 ? '#e8f8ea' : '#f8e8e8',
                        color: record.amount >= 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: 'medium'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={record.paymentMethod || "Cash"} 
                      size="small"
                      icon={<PaymentIcon fontSize="small" />}
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Box>
                      <IconButton 
                        onClick={() => handleEdit(record)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        onClick={() => record._id && deleteRecord(record._id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // Desktop view with table
  return (
    <TableContainer sx={{ maxHeight: 440, mt: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Table stickyHeader aria-label="financial records table" size="small">
        <TableHead>
          <TableCell sx={{ fontWeight: 'bold', bgcolor: '#3498db', color: 'white' }}>Date</TableCell>
          <TableCell sx={{ fontWeight: 'bold', bgcolor: '#3498db', color: 'white' }}>Description</TableCell>
          <TableCell sx={{ fontWeight: 'bold', bgcolor: '#3498db', color: 'white' }}>Amount</TableCell>
          <TableCell sx={{ fontWeight: 'bold', bgcolor: '#3498db', color: 'white' }}>Category</TableCell>
          <TableCell sx={{ fontWeight: 'bold', bgcolor: '#3498db', color: 'white' }}>Payment</TableCell>
          <TableCell sx={{ fontWeight: 'bold', bgcolor: '#3498db', color: 'white' }}>Actions</TableCell>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow 
              key={record._id}
              sx={{ 
                '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' },
                '&:hover': { bgcolor: '#e8f4f8' },
                transition: 'background-color 0.2s'
              }}
            >
              {editingId === record._id ? (
                // Edit mode
                <>
                  <TableCell>
                    <TextField
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      <Select
                        name="category"
                        value={editData.category}
                        onChange={handleChange}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                      <Select
                        name="paymentMethod"
                        value={editData.paymentMethod || "Cash"}
                        onChange={handleChange}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Debit Card">Debit Card</MenuItem>
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Save">
                        <IconButton 
                          onClick={() => record._id && handleSave(record._id)}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton 
                          onClick={handleCancel}
                          size="small"
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </>
              ) : (
                // View mode
                <>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {record.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{ 
                        color: record.amount >= 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold'
                      }}
                    >
                      {formatCurrency(record.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={record.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: record.amount >= 0 ? '#e8f8ea' : '#f8e8e8',
                        color: record.amount >= 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: 'medium'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={record.paymentMethod || "Cash"} 
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEdit(record)}
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => record._id && deleteRecord(record._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};