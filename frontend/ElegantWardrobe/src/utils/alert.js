// utils/alert.js
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const showSuccessAlert = (title, message) => {
  MySwal.fire({
    icon: 'success',
    title: title,
    text: message,
    showConfirmButton: true,
  });
};

export const showErrorAlert = (title, message) => {
  MySwal.fire({
    icon: 'error',
    title: title,
    text: message,
  });
};
