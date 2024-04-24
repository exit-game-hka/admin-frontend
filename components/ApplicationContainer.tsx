import React, {PropsWithChildren} from 'react';
import ThemeRegistry from "@/app/themeRegistry";
import {LayoutComponent} from "@/components/LayoutComponent";
import {ApplicationContextProvider} from "@/contexts/ApplicationContext";

type Props = PropsWithChildren;

export const ApplicationContainer: React.FC<Props> = (props: Props) => {
    const { children } = props;
    return (
        <ThemeRegistry options={{ key: "joy" }}>
            <ApplicationContextProvider>
                <LayoutComponent>{children}</LayoutComponent>
            </ApplicationContextProvider>
        </ThemeRegistry>
    );
};

