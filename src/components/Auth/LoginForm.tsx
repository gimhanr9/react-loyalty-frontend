import React from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  FormControl,
  Tooltip,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Phone, Info } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { loginRequest, clearError } from "../../store/slices/authSlice";
import { countryCodes, type CountryCode } from "../../data/countryCodes";
import {
  validatePhoneNumber,
  formatPhoneNumber,
  getValidationInfo,
} from "../../utils/phoneValidation";

const validationSchema = yup.object({
  countryCode: yup.string().required("Country code is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("phone-validation", function (value) {
      const { countryCode } = this.parent;
      if (!value || !countryCode)
        return this.createError({ message: "Phone number is required" });

      const isValid = validatePhoneNumber(value, countryCode);
      if (!isValid) {
        const validationInfo = getValidationInfo(countryCode);
        return this.createError({
          message: `Please enter a valid phone number (${validationInfo.minLength}-${validationInfo.maxLength} digits). Example: ${validationInfo.example}`,
        });
      }
      return true;
    }),
});

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryCode>(
    countryCodes.find((c) => c.code === "US") || countryCodes[0]
  );

  const formik = useFormik({
    initialValues: {
      countryCode: selectedCountry.dialCode,
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const fullPhoneNumber = `${
        values.countryCode
      }${values.phoneNumber.replace(/[^\d]/g, "")}`;
      dispatch(loginRequest({ phoneNumber: fullPhoneNumber }));
    },
  });

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCountryChange = (event: any, newValue: CountryCode | null) => {
    if (newValue) {
      setSelectedCountry(newValue);
      formik.setFieldValue("countryCode", newValue.dialCode);
      // Clear phone number when country changes to avoid validation conflicts
      formik.setFieldValue("phoneNumber", "");
    }
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const formatted = formatPhoneNumber(value, selectedCountry.dialCode);
    formik.setFieldValue("phoneNumber", formatted);
  };

  const getFullPhoneNumber = () => {
    if (formik.values.phoneNumber) {
      return `${formik.values.countryCode}${formik.values.phoneNumber.replace(
        /[^\d]/g,
        ""
      )}`;
    }
    return "";
  };

  const validationInfo = getValidationInfo(selectedCountry.dialCode);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Square Loyalty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in with your phone number
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ width: "100%" }}
          >
            {/* Country Code Selector */}
            <FormControl fullWidth margin="normal">
              <Autocomplete
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countryCodes}
                getOptionLabel={(option) =>
                  `${option.flag} ${option.name} (${option.dialCode})`
                }
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ mr: 2, fontSize: "1.2em" }}>{option.flag}</Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.dialCode}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    error={
                      formik.touched.countryCode &&
                      Boolean(formik.errors.countryCode)
                    }
                    helperText={
                      formik.touched.countryCode && formik.errors.countryCode
                    }
                  />
                )}
              />
            </FormControl>

            {/* Phone Number Input */}
            <Box sx={{ position: "relative" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                autoFocus
                value={formik.values.phoneNumber}
                onChange={handlePhoneNumberChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? formik.errors.phoneNumber
                    : `Example: ${validationInfo.example}`
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone />
                        <Typography variant="body2" color="text.secondary">
                          {selectedCountry.dialCode}
                        </Typography>
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title="If there is no account associated with this phone number, an account will be created for you automatically."
                        placement="top"
                        arrow
                      >
                        <IconButton size="small" edge="end">
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                placeholder={`Enter ${validationInfo.minLength}-${validationInfo.maxLength} digits`}
              />
            </Box>

            {/* Preview of full phone number */}
            {formik.values.phoneNumber && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Full number: <strong>{getFullPhoneNumber()}</strong>
                </Typography>
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading || !formik.isValid}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
