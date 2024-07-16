"use client";
import React, {createContext, useContext, PropsWithChildren} from "react";
import useStompClient from "@/hooks/useStompClient";

type Output = {
    hasSubscribed: boolean,
    subscribeToNotifications: () => void,
    unSubscribeToNotifications: () => void,
};

// @ts-ignore
export const NotificationContext = createContext<Output>({});

export const useNotificationContext = () => useContext(NotificationContext);

const NotificationContextProvider: React.FC<Readonly<PropsWithChildren>> = (props) => {
    const {
        hasSubscribed,
        subscribeToNotifications,
        unSubscribeToNotifications,
    } = useStompClient();


    return (
        <NotificationContext.Provider
            value={{
                hasSubscribed,
                subscribeToNotifications,
                unSubscribeToNotifications,
            }}
        >
            {props.children}
        </NotificationContext.Provider>
    );
};

export default NotificationContextProvider;
