import { toast } from 'react-toastify';

// Configure toast settings
const toastConfig = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

class ToasterService {
  static success(message, options = {}) {
    return toast.success(message, {
      ...toastConfig,
      ...options
    });
  }

  static error(message, options = {}) {
    return toast.error(message, {
      ...toastConfig,
      autoClose: 4000, // Longer for errors
      ...options
    });
  }

  static warning(message, options = {}) {
    return toast.warning(message, {
      ...toastConfig,
      ...options
    });
  }

  static info(message, options = {}) {
    return toast.info(message, {
      ...toastConfig,
      ...options
    });
  }
}

export default ToasterService;