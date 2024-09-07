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
};

export default Notification;
