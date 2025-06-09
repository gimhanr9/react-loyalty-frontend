"use client";

import type React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add,
  ShoppingCart,
  Restaurant,
  LocalGasStation,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { earnPointsRequest } from "../../store/slices/loyaltySlice";

const validationSchema = yup.object({
  amount: yup
    .number()
    .min(1, "Amount must be at least $1")
    .max(10000, "Amount cannot exceed $10,000")
    .required("Amount is required"),
  description: yup
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description cannot exceed 100 characters")
    .required("Description is required"),
});

const quickActions = [
  {
    label: "Grocery Shopping",
    amount: 50,
    icon: <ShoppingCart />,
    description: "Grocery store purchase",
  },
  {
    label: "Restaurant",
    amount: 25,
    icon: <Restaurant />,
    description: "Restaurant dining",
  },
  {
    label: "Gas Station",
    amount: 30,
    icon: <LocalGasStation />,
    description: "Gas station purchase",
  },
];

const EarnPoints: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.loyalty);

  const formik = useFormik({
    initialValues: {
      amount: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(
        earnPointsRequest({
          amount: Number(values.amount),
          description: values.description,
        })
      );
      resetForm();
    },
  });

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    formik.setValues({
      amount: action.amount.toString(),
      description: action.description,
    });
  };

  const calculatePoints = (amount: string) => {
    const numAmount = Number(amount);
    return isNaN(numAmount) ? 0 : Math.floor(numAmount * 2);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Earn Points
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Earn 2 points for every dollar spent
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {quickActions.map((action, index) => (
                  <Chip
                    key={index}
                    icon={action.icon}
                    label={`${action.label} - $${action.amount}`}
                    onClick={() => handleQuickAction(action)}
                    clickable
                    variant="outlined"
                    sx={{ py: 2, px: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Earn Points Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Record Purchase
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="amount"
                  label="Purchase Amount"
                  name="amount"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      max: 10000,
                      step: 0.01,
                    },
                    input: {
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  placeholder="Describe your purchase..."
                />

                {formik.values.amount && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    You will earn{" "}
                    <strong>
                      {calculatePoints(formik.values.amount)} points
                    </strong>{" "}
                    for this purchase
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading ?? !formik.isValid}
                >
                  {loading ? "Processing..." : "Earn Points"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Points Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How It Works
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • Earn 2 points for every $1 spent
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • Points are added instantly
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • Use points for rewards and discounts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Points never expire
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EarnPoints;
