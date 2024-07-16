"use client";
import React from "react";
import useApplicationContext from "@/hooks/useApplicationContext";
import dynamic from "next/dynamic";

const NotificationPopUpComponent = dynamic(
    () => import("@/components/NotificationPopUpComponent"),
    { ssr: false }
);

const WebSocketNotification: React.FC = () => {
    const appContext = useApplicationContext();

    return (
        <>
            {appContext.newNotification ?
                <NotificationPopUpComponent
                    isOpen={true}
                    notification={appContext.newNotification}
                    onClose={() => appContext.setNewNotification(undefined)}
                />
                : null
            }
        </>
    );
}

export default WebSocketNotification;
