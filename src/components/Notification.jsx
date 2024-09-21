// src/components/Notification.js
import Swal from 'sweetalert2';

/**
 * Provides a set of utility functions for displaying notifications to the user.
 *
 * The `Notification` object contains three methods:
 *
 * - `success(message)`: Displays a success notification with the provided message.
 * - `error(message)`: Displays an error notification with the provided message.
 * - `delete(message)`: Displays a confirmation dialog for a delete action with the provided message, and returns a Promise that resolves to `true` if the user confirms the action, or `false` otherwise.
 *
 * These methods use the `sweetalert2` library to display the notifications and dialogs.
 */
const Notification = {
  success: (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  },

  error: (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  },

  delete: async (message) => {
    const result = await Swal.fire({
      title: 'Delete',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    console.log(result);
    return result.isConfirmed;
  },
};

export default Notification;
