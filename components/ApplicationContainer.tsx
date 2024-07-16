import React, {PropsWithChildren} from 'react';
import ThemeRegistry from "@/app/themeRegistry";
import LayoutComponent from "@/components/LayoutComponent";
import {ApplicationContextProvider} from "@/contexts/ApplicationContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import dynamic from "next/dynamic";

const NotificationContextProvider = dynamic(
    () => import("@/contexts/NotificationContext"),
    { ssr: false }
);

type Props = PropsWithChildren;

export const ApplicationContainer: React.FC<Props> = (props: Props) => {
    const { children } = props;
    return (
        <ThemeRegistry options={{ key: "joy" }}>
            <SessionProviderWrapper>
                <ApplicationContextProvider>
                    <NotificationContextProvider>
                        <LayoutComponent>{children}</LayoutComponent>
                    </NotificationContextProvider>
                </ApplicationContextProvider>
            </SessionProviderWrapper>
        </ThemeRegistry>
    );
};
