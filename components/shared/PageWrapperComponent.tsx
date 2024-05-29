"use client";
import React, {PropsWithChildren, ReactNode, useEffect} from "react";
import styled from "styled-components";
import {Box, Stack, Typography, useTheme} from "@mui/joy";
import {usePathname} from "next/navigation";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type Props = PropsWithChildren & {
    title?: string;
    subtitle?: string;
    rightContent?: ReactNode;
};

export const PageWrapperComponent: React.FC<Props> = (props) => {
    const { title, subtitle, rightContent, children } = props;
    const pathname = usePathname();
    const theme = useTheme();
    const { isSmall } = useMediaQuery();

    const charactersToExcludeFromUrl = ["/", "-", "\\", "[", "]"];

    const resolveWindowTitleFromPathName = (pathname: string): string => {
        if (!pathname) return "";
        let result = pathname === "/" ? "Startseite" : pathname.slice(1);

        charactersToExcludeFromUrl.forEach((character) => {
            if (!result.includes(character)) return;

            const cleanText = result.replaceAll(character, " ");
            result = cleanText.slice(0);
        });

        return `${result.charAt(0).toUpperCase()}${result.slice(1)}`;
    };

    useEffect(() => {
        document.title = `${resolveWindowTitleFromPathName(pathname)} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`;
    }, [title, subtitle, children, resolveWindowTitleFromPathName, pathname]);

    return (
        <PageContainer>
            <Stack
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    backgroundColor: theme => theme.vars.palette.background.body,
                    flexDirection: isSmall ? "column" : "row",
                    gap: "5px",
                    justifyContent: "space-between",
                    justifyItems: "space-between",
                    alignItems: isSmall ? "unset" : "center",
                    alignContent: isSmall ? "unset" : "center",
                    paddingBottom: "var(--gap-2)",
                    paddingTop: title ? "var(--gap-4)" : "unset",
                }}
            >
                <TitleAndSubtitleContainer
                    component="div"
                    bgcolor={theme.vars.palette.background.body}
                >
                    <Typography level="h2">{title}</Typography>
                    <Typography level="title-sm">{subtitle}</Typography>
                </TitleAndSubtitleContainer>
                {rightContent ?
                    <Stack
                    sx={{
                        display: isSmall ? "grid" : "flex",
                        gap: "var(--gap-2)",

                    }}>
                        {rightContent}
                    </Stack> : null
                }
            </Stack>
            <Box component="main">{children}</Box>
        </PageContainer>
    );
};
const PageContainer = styled(Box)``;

const TitleAndSubtitleContainer = styled(Box)<{ bgcolor: string }>`
    display: grid;
    gap: var(--gap-1);
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: ${(props) => props.bgcolor};
`;
