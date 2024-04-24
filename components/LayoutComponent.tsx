"use client";
import React, { PropsWithChildren } from "react";
import { Box } from "@mui/joy";
import styled from "styled-components";
import { AppBarComponent } from "@/components/AppBarComponent";
import { SidebarComponent } from "@/components/SidebarComponent";

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
export const LayoutComponent: React.FC<Props> = (props: PropsWithChildren) => {
    const { children } = props;

    return (
        <ApplicationMainContainer>
            <AppBarComponent />
            <SidebarAndMainContentContainer>
                <StickyContainer>
                    <SidebarComponent />
                </StickyContainer>
                <MainBoxContainer component="main">{children}</MainBoxContainer>
            </SidebarAndMainContentContainer>
        </ApplicationMainContainer>
    );
};

const ApplicationMainContainer = styled(Box)`
    display: grid;
    overflow: hidden;
`;

const StickyContainer = styled(Box)<{ zindex?: number }>`
    position: sticky;
    top: 0;
    left: 0;
    z-index: ${(props) => props.zindex ?? "unset"};
`;

const SidebarAndMainContentContainer = styled(Box)`
    display: grid;
    grid-template-columns: max-content 1fr;
    height: calc(100vh - var(--appbar-min-height));
    margin-top: var(--appbar-min-height);
`;

const MainBoxContainer = styled(Box)`
    padding: 0 var(--gap-4) var(--gap-8) var(--gap-4);
    border-radius: var(--gap-1) 0 0 0;
    width: 100%;

    @media screen and (max-width: 900px) {
        padding: 0 var(--gap-2) var(--gap-8) var(--gap-2);
    }
`;
