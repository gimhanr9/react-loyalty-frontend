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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Add,
  ShoppingCart,
  Restaurant,
  LocalGasStation,
  Close,
  LocalOffer,
  CheckCircle,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../store";
import {
  earnPointsRequest,
  fetchRewardTierRequest,
  redeemPointsRequest,
} from "../../store/slices/loyaltySlice";

const validationSchema = yup.object({
  amount: yup
    .number()
    .min(100, "Amount must be at least $1")
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
    amount: 500,
    icon: <ShoppingCart />,
    description: "Grocery store purchase",
  },
  {
    label: "Restaurant",
    amount: 250,
    icon: <Restaurant />,
    description: "Restaurant dining",
  },
  {
    label: "Gas Station",
    amount: 300,
    icon: <LocalGasStation />,
    description: "Gas station purchase",
  },
];

const EarnPoints: React.FC = () => {
  const dispatch = useDispatch();
  const { rewardTier, loading, error } = useSelector(
    (state: RootState) => state.loyalty
  );
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<{
    amount: number;
    description: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchRewardTierRequest());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      amount: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = {
        amount: Number(values.amount),
        description: values.description,
      };

      // Check if discount is available
      if (rewardTier && rewardTier.discountPercentage > 0) {
        setPendingFormData(formData);
        setShowDiscountDialog(true);
      } else {
        // No discount available, proceed directly
        dispatch(earnPointsRequest(formData));
        resetForm();
      }
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

  const calculateDiscountedPrice = (originalPrice: number) => {
    if (!rewardTier || rewardTier.discountPercentage <= 0) return originalPrice;
    return originalPrice * (1 - rewardTier.discountPercentage / 100);
  };

  const handleContinueWithoutDiscount = () => {
    if (pendingFormData) {
      dispatch(earnPointsRequest(pendingFormData));
      formik.resetForm();
      setPendingFormData(null);
    }
    setShowDiscountDialog(false);
  };

  const handleRedeemDiscount = () => {
    if (pendingFormData) {
      dispatch(
        redeemPointsRequest({
          amount: pendingFormData.amount,
          description: pendingFormData.description,
          rewardtier: rewardTier?.rewardTierId ?? "",
        })
      );
      formik.resetForm();
      setPendingFormData(null);
    }
    setShowDiscountDialog(false);
  };

  const handleCloseDialog = () => {
    setShowDiscountDialog(false);
    setPendingFormData(null);
  };

  const hasDiscount = rewardTier && rewardTier.discountPercentage > 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Earn Points
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
                {hasDiscount && (
                  <Chip
                    icon={<LocalOffer />}
                    label={`${rewardTier.discountPercentage}% OFF Available`}
                    color="success"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                )}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {quickActions.map((action, index) => {
                  const originalPrice = action.amount;
                  const discountedPrice =
                    calculateDiscountedPrice(originalPrice);
                  const showDiscount =
                    hasDiscount && discountedPrice < originalPrice;

                  return (
                    <Box key={index} sx={{ position: "relative" }}>
                      <Chip
                        icon={action.icon}
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>{action.label}</span>
                            {showDiscount ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "text.secondary",
                                  }}
                                >
                                  ${originalPrice}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "success.main",
                                  }}
                                >
                                  ${discountedPrice.toFixed(2)}
                                </Typography>
                              </Box>
                            ) : (
                              <span>- ${originalPrice}</span>
                            )}
                          </Box>
                        }
                        onClick={() => handleQuickAction(action)}
                        clickable
                        variant="outlined"
                        sx={{ py: 2, px: 1 }}
                        color={showDiscount ? "success" : "default"}
                      />
                      {showDiscount && (
                        <Chip
                          label={`${rewardTier.discountPercentage}% OFF`}
                          size="small"
                          color="success"
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
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

                {/* Show discounted price if applicable */}
                {formik.values.amount && hasDiscount && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Alert severity="success" icon={<LocalOffer />}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box>
                          <Typography variant="body2">
                            Original:{" "}
                            <span style={{ textDecoration: "line-through" }}>
                              ${formik.values.amount}
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: "success.main" }}
                          >
                            With {rewardTier.discountPercentage}% discount: $
                            {calculateDiscountedPrice(
                              Number(formik.values.amount)
                            ).toFixed(2)}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${rewardTier.discountPercentage}% OFF`}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </Alert>
                  </Box>
                )}

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
      </Grid>

      {/* Discount Confirmation Dialog */}
      <Dialog
        open={showDiscountDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocalOffer color="success" />
            <Typography variant="h6">Discount Available!</Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              🎉 You have a {rewardTier?.discountPercentage}% discount
              available!
            </Typography>
            <Typography variant="body2">
              You can apply this discount to your current purchase and save
              money.
            </Typography>
          </Alert>

          {pendingFormData && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Purchase Details:
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Original Amount:</Typography>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through" }}
                >
                  ${pendingFormData.amount}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  With {rewardTier?.discountPercentage}% discount:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "success.main" }}
                >
                  ${calculateDiscountedPrice(pendingFormData.amount).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "success.main", fontWeight: "bold" }}
                >
                  You save:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "success.main", fontWeight: "bold" }}
                >
                  $
                  {(
                    pendingFormData.amount -
                    calculateDiscountedPrice(pendingFormData.amount)
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            What would you like to do?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleContinueWithoutDiscount}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Continue Without Discount
          </Button>
          <Button
            onClick={handleRedeemDiscount}
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
          >
            Apply {rewardTier?.discountPercentage}% Discount
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EarnPoints;
