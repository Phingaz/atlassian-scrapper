import { featureFlag } from "@/lib/utils";
import React from "react";
import { toast } from "sonner";

const useSocket = () => {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [ws, setWs] = React.useState<WebSocket | null>(null);

  React.useEffect(() => {
    if (!featureFlag.rss) return;

    const websocket = new WebSocket("ws://localhost:3001/ws");
    setWs(websocket);

    websocket.onmessage = (event) => {
      toast.info(event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (input: string) => {
    if (ws) ws.send(input);
  };

  return { messages, sendMessage };
};

export default useSocket;
