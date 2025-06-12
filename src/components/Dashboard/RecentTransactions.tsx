import type React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface Transaction {
  id: string;
  type: string;
  points: number;
  timestamp: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        {transactions.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No transactions yet
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Points</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {transaction.type === "ACCUMULATE_POINTS" ? (
                          <TrendingUp color="success" sx={{ mr: 1 }} />
                        ) : (
                          <TrendingDown color="error" sx={{ mr: 1 }} />
                        )}
                        {transaction.type}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={
                          transaction.points >= 0
                            ? "success.main"
                            : "error.main"
                        }
                        sx={{ fontWeight: "bold" }}
                      >
                        {transaction.points.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
