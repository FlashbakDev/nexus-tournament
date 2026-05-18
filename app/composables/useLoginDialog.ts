export function useLoginDialog() {
  const isOpen = useState<boolean>("login-dialog-open", () => false);
  const returnTo = useState<string>("login-dialog-return-to", () => "/");

  function openLoginDialog(returnToParam?: string) {
    returnTo.value = returnToParam ?? "/";
    isOpen.value = true;
  }

  function closeLoginDialog() {
    isOpen.value = false;
  }

  return {
    isOpen,
    returnTo,
    openLoginDialog,
    closeLoginDialog,
  };
}
