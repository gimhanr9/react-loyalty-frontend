import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { removeNotification } from "../../store/slices/uiSlice";

const NotificationBar: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.ui);
  const [currentNotification, setCurrentNotification] = useState<
    (typeof notifications)[0] | null
  >(null);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]);
    }
  }, [notifications, currentNotification]);

  const handleClose = () => {
    if (currentNotification) {
      dispatch(removeNotification(currentNotification.id));
      setCurrentNotification(null);
    }
  };

  return (
    <>
      {currentNotification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity={currentNotification.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationBar;
