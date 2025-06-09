import toast from "react-hot-toast";

// Shared toast style
const toastStyle = {
  background: "#171717",
  color: "#fff",
  border: "1px solid #333",
  fontSize: "14px",
};

// === Simple Reusable Toasts ===
export const showSuccess = (msg) =>
  toast.success(msg, { style: toastStyle });

export const showError = (msg) =>
  toast.error(msg, { style: toastStyle });

export const showLoading = (msg) =>
  toast.loading(msg, { style: toastStyle });

export const showToast = (msg) =>
  toast(msg, { style: toastStyle });

export const showWarning = (msg) =>
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-yellow-500 text-black border border-yellow-700 rounded shadow-lg p-3`}
    >
      ⚠️ {msg}
    </div>
  ));

export const dismissToast = (id) => toast.dismiss(id);

// === Promise-based toast ===
export const showPromise = (promiseFn, { loading, success, error }) =>
  toast.promise(
    promiseFn,
    { loading, success, error },
    { style: toastStyle }
  );
