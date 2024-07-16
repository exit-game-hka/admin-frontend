"use client";
import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Subscription} from "stompjs";
import useApplicationContext from "@/hooks/useApplicationContext";
import webSocketClient, {USER_NOTIFICATIONS_ENDPOINT} from "@/api/webSocketClient";
import {Notification} from "@/api/notification";

type Output = {
    hasSubscribed: boolean,
    subscribeToNotifications: () => void,
    unSubscribeToNotifications: () => void,
    isNotificationSoundActive: boolean,
    toggleNotificationSound: () => void,
};

// @ts-ignore
export const NotificationContext = createContext<Output>({});

export const useNotificationContext = () => useContext(NotificationContext);

const PUSH_NOTIFICATIONS_ENABLED_LOCAL_STORAGE_KEY = "push-notifications-enabled" as const;
const PUSH_NOTIFICATIONS_SOUND_ENABLED_LOCAL_STORAGE_KEY = "push-notifications-sound-enabled" as const;

const NotificationContextProvider: React.FC<Readonly<PropsWithChildren>> = (props) => {
    const [webSocketSubscription, setWebSocketSubscription] = useState<Subscription | undefined>(undefined);
    const appContext = useApplicationContext();
    const [hasSubscribed, setHasSubscribed] = useState(false);

    useEffect(() => {
        const isPushNotificationsEnabled = window.localStorage
            .getItem(PUSH_NOTIFICATIONS_ENABLED_LOCAL_STORAGE_KEY) === "true";

        webSocketClient.onConnect = () => {
            if (!isPushNotificationsEnabled) return;
            subscribeToNotifications();
        };
        webSocketClient.activate();

        return () => {
            if (!webSocketClient.connected) return;
            webSocketClient.deactivate();
        };
    }, []);

    useEffect(() => {
        if (!webSocketSubscription) {
            setHasSubscribed(false);
            return;
        }
        setHasSubscribed(true);
    }, [webSocketSubscription]);

    useEffect(() => {
        if (
            !appContext.newNotification ||
            window.localStorage.getItem(PUSH_NOTIFICATIONS_SOUND_ENABLED_LOCAL_STORAGE_KEY) !== "true"
        ) return;

        const notificationSoundEffect = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH}/soundfx/new-notification.mp3`);
        notificationSoundEffect.play();
        return () => {
            notificationSoundEffect.pause();
            notificationSoundEffect.remove();
        };
    }, [appContext.newNotification, appContext.setNewNotification]);

    const subscribeToNotifications = () => {
        setWebSocketSubscription(
            webSocketClient.subscribe(USER_NOTIFICATIONS_ENDPOINT, (payload: any) => {
                appContext.setNewNotification(JSON.parse(payload.body) as Notification);
            })
        );
        window.localStorage.setItem(PUSH_NOTIFICATIONS_ENABLED_LOCAL_STORAGE_KEY, "true");
    };

    const unSubscribeToNotifications = () => {
        if (!webSocketSubscription) {
            console.error("No active subscription to unsubscribe from");
            return;
        }
        webSocketSubscription.unsubscribe();
        setWebSocketSubscription(undefined);
        turnOffNotificationSound();
        window.localStorage.setItem(PUSH_NOTIFICATIONS_ENABLED_LOCAL_STORAGE_KEY, "false");
    };

    const [isNotificationSoundActive, setIsNotificationSoundActive] = useState<boolean>(
        window.localStorage
            .getItem(PUSH_NOTIFICATIONS_SOUND_ENABLED_LOCAL_STORAGE_KEY) === "true"
    );

    const toggleNotificationSound = () => {
        if (!isNotificationSoundActive) {
            turnOnNotificationSound();
            return;
        }
        turnOffNotificationSound();
    };

    const turnOnNotificationSound = () => {
        setIsNotificationSoundActive(true);
        window.localStorage.setItem(PUSH_NOTIFICATIONS_SOUND_ENABLED_LOCAL_STORAGE_KEY, "true");
    };

    const turnOffNotificationSound = () => {
        setIsNotificationSoundActive(false);
        window.localStorage.setItem(PUSH_NOTIFICATIONS_SOUND_ENABLED_LOCAL_STORAGE_KEY, "false");
    };

    return (
        <NotificationContext.Provider
            value={{
                hasSubscribed,
                subscribeToNotifications,
                unSubscribeToNotifications,
                isNotificationSoundActive,
                toggleNotificationSound,
            }}
        >
            {props.children}
        </NotificationContext.Provider>
    );
};

export default NotificationContextProvider;
