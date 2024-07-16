import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";

const webSocketClient: Client = new Client({
    webSocketFactory: () => SockJS(process.env.NEXT_PUBLIC_WEBSOCKET_NOTIFICATIONS_SERVER_URL as string),
    reconnectDelay: Number(process.env.NEXT_PUBLIC_WEBSOCKET_NOTIFICATIONS_RECONNECTION_DELAY),
    heartbeatIncoming: Number(process.env.NEXT_PUBLIC_WEBSOCKET_NOTIFICATIONS_INCOMING_HEARTBEAT),
    heartbeatOutgoing: Number(process.env.NEXT_PUBLIC_WEBSOCKET_NOTIFICATIONS_OUTGOING_HEARTBEAT),
});

export default webSocketClient;
