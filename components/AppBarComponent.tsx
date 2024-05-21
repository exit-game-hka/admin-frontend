import React from "react";
import styled from "styled-components";
import {Box, Card, Divider, Sheet, Stack, Typography} from "@mui/joy";

/**
 * React-Komponente für die App Bar der Anwendung.
 *
 * Stellt die Navigationselemente und die Suchfunktion bereit.
 */
export const AppBarComponent: React.FC = () => {
    return (
        <NavigationWrapper>
            <NavigationBarContainer>
                <Stack direction="row" spacing="var(--gap-1)">
                    <Typography component="p" level="body-md">
                        {process.env.NEXT_PUBLIC_APPLICATION_NAME!}
                    </Typography>
                </Stack>
                <NavigationBarOptionsContainer />
            </NavigationBarContainer>
            <Divider orientation={"horizontal"} />
        </NavigationWrapper>
    );
};

const NavigationWrapper = styled(Sheet)`
    display: grid;
    position: fixed;
    grid-template-rows: 1fr max-content;
    top: 0;
    left: 0;
    z-index: 1000;
    height: var(--appbar-min-height);
    width: 100%;
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
`;

const NavigationBarContainer = styled(Sheet)`
    display: grid;
    grid-template-columns: 1fr max-content;
    grid-gap: var(--gap-2);
    align-content: center;
    align-items: center;
    padding: var(--gap-1) var(--gap-2);
    height: 100%;
`;

const NavigationBarOptionsContainer = styled(Box)`
    display: flex;
    gap: var(--gap-1);
`;
