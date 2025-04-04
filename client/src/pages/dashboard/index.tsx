import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../contexts/financial-record-context";

export const Dashboard = () => {
  const { records } = useFinancialRecords();

  return (
    <div className="dashboard-container">
      <h1>Financial Dashboard</h1>
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Records</h3>
          <p>{records.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Amount</h3>
          <p>
            ${records.reduce((sum, record) => sum + record.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>
      <FinancialRecordForm />
      <FinancialRecordList />
    </div>
  );
};