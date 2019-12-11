import { store as notifications } from "react-notifications-component";

function notificationa(message, type) {
  notifications.addNotification({
    message: message,
    type: type,
    insert: "top",
    container: "bottom-right",
    dismiss: {
      duration: 5000
    }
  });
}

export default notificationa;
