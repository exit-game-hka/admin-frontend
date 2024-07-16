"use client";
import React, { PropsWithChildren } from "react";
import { Box } from "@mui/joy";
import styled from "styled-components";
import dynamic from "next/dynamic";

const AppBarComponent = dynamic(
    () => import("@/components/AppBarComponent"),
    { ssr: false }
);

const SidebarComponent = dynamic(
    () => import("@/components/SidebarComponent"),
    { ssr: false }
);

const WebSocketNotification = dynamic(
    () => import("@/components/WebSocketNotification"),
    { ssr: false }
);
/**
 * Typ-Alias für die Eigenschaften der `LayoutComponent`.
 *
 * Erbt von `PropsWithChildren`, welches die Kinder-Komponenten beinhaltet.
 */
type Props = PropsWithChildren;

/**
 * React-Komponente fürs Layout der Anwendung.
 *
 * @param props - Eigenschaften der Komponente.
 */
const LayoutComponent: React.FC<Props> = (props: PropsWithChildren) => {
    const { children } = props;

    return (
        <ApplicationMainContainer>
            <AppBarComponent />
            <SidebarAndMainContentContainer>
                <SidebarStickyContainer>
                    <SidebarComponent />
                </SidebarStickyContainer>
                <MainBoxWrapper component="div">
                    <MainBoxContainer component="main">
                        {children}
                    </MainBoxContainer>
                </MainBoxWrapper>
                <WebSocketNotification />
            </SidebarAndMainContentContainer>
        </ApplicationMainContainer>
    );
};

const ApplicationMainContainer = styled(Box)`
    display: grid;
    overflow: hidden;
`;

const SidebarStickyContainer = styled(Box)<{ zindex?: number }>`
    position: sticky;
    top: 0;
    left: 0;
    z-index: ${(props) => props.zindex ?? "unset"};
    @media screen and (max-width: 992px) {
        display: none;
    }
`;

const SidebarAndMainContentContainer = styled(Box)`
    display: grid;
    grid-template-columns: max-content 1fr;
    height: calc(100vh - var(--appbar-min-height));
    margin-top: var(--appbar-min-height);
    
    @media screen and (max-width: 992px) {
        grid-template-columns: 1fr;
    }
`;

const MainBoxWrapper = styled(Box)`
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    justify-items: center;
    overflow-y: auto
`;

const MainBoxContainer = styled(Box)`
    padding: 0 var(--gap-4) var(--gap-8) var(--gap-4);
    border-radius: var(--gap-1) 0 0 0;
    width: 100%;
    max-width: var(--page-main-content-max-width);

    @media screen and (max-width: 900px) {
        padding: 0 var(--gap-2) var(--gap-8) var(--gap-2);
    }
`;

export default LayoutComponent;
