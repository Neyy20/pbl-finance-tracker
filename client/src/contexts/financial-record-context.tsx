import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod?: string; // Add this field to match server schema
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: Omit<FinancialRecord, "userId">) => Promise<void>;
  updateRecord: (id: string, newRecord: Partial<FinancialRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

const FinancialRecordsContext = createContext<FinancialRecordsContextType | undefined>(undefined);

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);
  if (!context) {
    throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider");
  }
  return context;
};

export const FinancialRecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize records as an empty array to ensure it's always an array
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  // Update the API_URL to use environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  console.log('Using API URL:', API_URL); // Add this for debugging
  
  // Update any fetch calls to use the API_URL
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Authentication required');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/records`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array before setting it
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching records:", error);
      // Set empty array on error to prevent map errors
      setRecords([]);
    }
  };

  const addRecord = async (record: Omit<FinancialRecord, "userId">) => {
    if (!user) return;
    
    // Add userId to the record
    const recordWithUserId = { ...record, userId: user._id };
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Authentication required');
        return;
      }
      
      const response = await fetch(`${API_URL}/api/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(recordWithUserId),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add record");
      }
      
      const newRecord = await response.json();
      setRecords([...records, newRecord]);
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const updateRecord = async (id: string, newRecord: Partial<FinancialRecord>) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Authentication required');
        return;
      }
      
      const response = await fetch(
        `${API_URL}/api/records/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(newRecord),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to update record");
      }
      
      const updatedRecord = await response.json();
      setRecords(
        records.map((record) =>
          record._id === id ? { ...record, ...updatedRecord } : record
        )
      );
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('Authentication required');
        return;
      }
      
      const response = await fetch(
        `${API_URL}/api/records/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to delete record");
      }
      
      setRecords(records.filter((record) => record._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{
        records,
        addRecord,
        updateRecord,
        deleteRecord,
      }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};