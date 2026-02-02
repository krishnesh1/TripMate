export const useToast = () => {
  const toast = (msg) => {
    alert(msg);   // simple version (later you can improve UI)
  };

  return { toast };
};
