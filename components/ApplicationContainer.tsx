import React, {PropsWithChildren} from 'react';
import ThemeRegistry from "@/app/themeRegistry";
import LayoutComponent from "@/components/LayoutComponent";
import {ApplicationContextProvider} from "@/contexts/ApplicationContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

type Props = PropsWithChildren;

export const ApplicationContainer: React.FC<Props> = (props: Props) => {
    const { children } = props;
    return (
        <ThemeRegistry options={{ key: "joy" }}>
            <SessionProviderWrapper>
                <ApplicationContextProvider>
                    <LayoutComponent>{children}</LayoutComponent>
                </ApplicationContextProvider>
            </SessionProviderWrapper>
        </ThemeRegistry>
    );
};

