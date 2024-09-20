// src/components/Notification.js
import Swal from 'sweetalert2';

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

  // for delete..
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
