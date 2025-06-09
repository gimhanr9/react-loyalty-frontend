import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  id: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface PointsChartProps {
  transactions: Transaction[];
}

const PointsChart: React.FC<PointsChartProps> = ({ transactions }) => {
  const chartData = React.useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0],
        earned: 0,
        redeemed: 0,
        balance: 0,
      };
    });

    let runningBalance = 0;

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sortedTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.timestamp)
        .toISOString()
        .split("T")[0];
      const dayIndex = last30Days.findIndex(
        (day) => day.date === transactionDate
      );

      if (dayIndex !== -1) {
        if (transaction.type === "earn") {
          last30Days[dayIndex].earned += transaction.points;
          runningBalance += transaction.points;
        } else {
          last30Days[dayIndex].redeemed += transaction.points;
          runningBalance -= transaction.points;
        }
      }
    });

    // Calculate running balance for each day
    let currentBalance = 0;
    return last30Days.map((day) => {
      currentBalance += day.earned - day.redeemed;
      return {
        ...day,
        balance: currentBalance,
        date: new Date(day.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [transactions]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Points Activity (Last 30 Days)
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="earned"
                stroke="#4caf50"
                strokeWidth={2}
                name="Earned"
              />
              <Line
                type="monotone"
                dataKey="redeemed"
                stroke="#f44336"
                strokeWidth={2}
                name="Redeemed"
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#2196f3"
                strokeWidth={3}
                name="Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PointsChart;
