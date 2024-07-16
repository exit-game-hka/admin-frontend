import {useEffect, useState} from "react";
import webSocketClient from "@/api/webSocketClient";
import useApplicationContext from "@/hooks/useApplicationContext";
import {Notification} from "@/api/notification";
import {Subscription} from "stompjs";

type Output = {
    hasSubscribed: boolean,
    subscribeToNotifications: () => void,
    unSubscribeToNotifications: () => void,
};

const USER_NOTIFICATIONS_ENDPOINT = "/topic/user-notifications" as const;

export const useStompClient = (): Output => {
    const [webSocketSubscription, setWebSocketSubscription] = useState<Subscription | undefined>(undefined);
    const appContext = useApplicationContext();
    const [hasSubscribed, setHasSubscribed] = useState(false);

    useEffect(() => {
        // Define the onConnect callback
        webSocketClient.onConnect = () => {
            // Subscribe to a topic
            setWebSocketSubscription(
                webSocketClient.subscribe(USER_NOTIFICATIONS_ENDPOINT, (payload: any) => {
                    appContext.setNewNotification(JSON.parse(payload.body) as Notification);
                })
            );
        };

        webSocketClient.activate();

        return () => {
            if (webSocketClient.connected) {
                webSocketClient.deactivate();
            }
        };
    }, []);

    useEffect(() => {
        if (!webSocketSubscription) {
            setHasSubscribed(false);
            return;
        }
        setHasSubscribed(true);
    }, [webSocketSubscription]);

    const subscribeToNotifications = () => {
        setWebSocketSubscription(
            webSocketClient.subscribe(USER_NOTIFICATIONS_ENDPOINT, (payload: any) => {
                appContext.setNewNotification(JSON.parse(payload.body) as Notification);
            })
        );
    };

    const unSubscribeToNotifications = () => {
        if (!webSocketSubscription) {
            console.error("No active subscription to unsubscribe from");
            return;
        }
        webSocketSubscription.unsubscribe();
        setWebSocketSubscription(undefined);
    }

    return {
        hasSubscribed,
        subscribeToNotifications,
        unSubscribeToNotifications,
    };
};

export default useStompClient;
