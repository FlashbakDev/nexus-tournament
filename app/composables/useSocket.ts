import { getSocket } from "~/utils/socket.client";

export function useSocket() {
  const socket = getSocket();
  const connected = ref(socket.connected);
  const transport = ref("N/A");

  function syncTransport() {
    if (socket.connected && socket.io.engine) {
      transport.value = socket.io.engine.transport.name;
    } else {
      transport.value = "N/A";
    }
  }

  function onConnect() {
    connected.value = true;
    syncTransport();
    socket.io.engine?.on("upgrade", (rawTransport) => {
      transport.value = rawTransport.name;
    });
  }

  function onDisconnect() {
    connected.value = false;
    transport.value = "N/A";
  }

  function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (socket.connected) {
        resolve();
        return;
      }

      const onConnectOnce = () => {
        socket.off("connect_error", onError);
        resolve();
      };

      const onError = (error: Error) => {
        socket.off("connect", onConnectOnce);
        reject(error);
      };

      socket.once("connect", onConnectOnce);
      socket.once("connect_error", onError);
      socket.connect();
    });
  }

  function disconnect(): void {
    socket.disconnect();
  }

  onMounted(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) {
      onConnect();
    }
  });

  onUnmounted(() => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  });

  return {
    socket,
    connected: readonly(connected),
    transport: readonly(transport),
    connect,
    disconnect,
  };
}
