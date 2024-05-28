"use client";
import React from "react";
import styled from "styled-components";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {Avatar, Box, Divider, IconButton, Sheet, Stack, Typography, useColorScheme} from "@mui/joy";
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import {SidebarOnMobileComponent} from "@/components/SidebarComponent";

/**
 * React-Komponente für die App Bar der Anwendung.
 *
 * Stellt die Navigationselemente und die Suchfunktion bereit.
 */
const AppBarComponent: React.FC = () => {
    const  { isSmall } = useMediaQuery();
    const { mode, setMode } = useColorScheme();

    const switchMode = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }

    return (
        <NavigationWrapper>
            <NavigationBarContainer>
                <Stack direction="row" spacing="var(--gap-1)">
                    {isSmall ? <SidebarOnMobileComponent /> : null}
                    <Typography component="p" level="body-md">
                        {isSmall ? "Exit-Game HKA" : process.env.NEXT_PUBLIC_APPLICATION_NAME!}
                    </Typography>
                </Stack>
                <NavigationBarOptionsContainer>
                    <IconButton onClick={switchMode}>
                        {mode === "light" ? <NightsStayOutlinedIcon /> : <WbSunnyOutlinedIcon />}
                    </IconButton>
                    <Avatar variant="outlined">MG</Avatar>
                </NavigationBarOptionsContainer>
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

export default AppBarComponent;
