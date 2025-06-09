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
  Divider,
} from "@mui/material";
import {
  Redeem,
  GifTwoTone,
  LocalOffer,
  Restaurant,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { redeemPointsRequest } from "../../store/slices/loyaltySlice";

const validationSchema = yup.object({
  points: yup
    .number()
    .min(100, "Minimum redemption is 100 points")
    .required("Points amount is required"),
  description: yup
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description cannot exceed 100 characters")
    .required("Description is required"),
});

const rewardOptions = [
  {
    label: "$5 Gift Card",
    points: 1000,
    icon: <GifTwoTone />,
    description: "$5 gift card redemption",
  },
  {
    label: "$10 Discount",
    points: 2000,
    icon: <LocalOffer />,
    description: "$10 discount coupon",
  },
  {
    label: "Free Meal",
    points: 1500,
    icon: <Restaurant />,
    description: "Free meal voucher",
  },
];

const RedeemPoints: React.FC = () => {
  const dispatch = useDispatch();
  const { balance, loading, error } = useSelector(
    (state: RootState) => state.loyalty
  );

  const formik = useFormik({
    initialValues: {
      points: "",
      description: "",
    },
    validationSchema: validationSchema.test(
      "sufficient-balance",
      "Insufficient points balance",
      (value) => {
        const points = Number(value.points);
        return points <= balance;
      }
    ),
    onSubmit: (values, { resetForm }) => {
      dispatch(
        redeemPointsRequest({
          points: Number(values.points),
          description: values.description,
        })
      );
      resetForm();
    },
  });

  const handleRewardSelection = (reward: (typeof rewardOptions)[0]) => {
    formik.setValues({
      points: reward.points.toString(),
      description: reward.description,
    });
  };

  const calculateValue = (points: string) => {
    const numPoints = Number(points);
    return isNaN(numPoints) ? 0 : (numPoints / 200).toFixed(2); // 200 points = $1
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Redeem Points
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Current Balance: <strong>{balance.toLocaleString()} points</strong>
      </Typography>

      <Grid container spacing={3}>
        {/* Available Rewards */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Rewards
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {rewardOptions.map((reward, index) => (
                  <Chip
                    key={index}
                    icon={reward.icon}
                    label={`${
                      reward.label
                    } - ${reward.points.toLocaleString()} pts`}
                    onClick={() => handleRewardSelection(reward)}
                    clickable
                    disabled={balance < reward.points}
                    variant="outlined"
                    sx={{ py: 2, px: 1 }}
                    color={balance >= reward.points ? "primary" : "default"}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Redeem Points Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Redemption
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {balance < 100 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  You need at least 100 points to make a redemption
                </Alert>
              )}

              <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="points"
                  label="Points to Redeem"
                  name="points"
                  type="number"
                  slotProps={{
                    htmlInput: { min: 100, max: balance, step: 100 },
                  }}
                  value={formik.values.points}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.points && Boolean(formik.errors.points)}
                  helperText={formik.touched.points && formik.errors.points}
                  disabled={balance < 100}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Redemption Description"
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
                  placeholder="Describe what you're redeeming for..."
                  disabled={balance < 100}
                />

                {formik.values.points && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Redemption value:{" "}
                    <strong>${calculateValue(formik.values.points)}</strong>
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Redeem />
                  }
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading || !formik.isValid || balance < 100}
                >
                  {loading ? "Processing..." : "Redeem Points"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Redemption Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Redemption Guide
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • 200 points = $1 value
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • Minimum redemption: 100 points
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  • Rewards are processed instantly
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Check your email for redemption details
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Your Balance
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {balance.toLocaleString()} points
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ≈ ${(balance / 200).toFixed(2)} value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RedeemPoints;
