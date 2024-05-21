"use client";
import React, {PropsWithChildren, ReactNode, useEffect} from "react";
import styled from "styled-components";
import {Box, Stack, Typography, useTheme} from "@mui/joy";
import {usePathname} from "next/navigation";

type Props = PropsWithChildren & {
    title?: string;
    subtitle?: string;
    rightContent?: ReactNode;
};

export const PageWrapperComponent: React.FC<Props> = (props) => {
    const { title, subtitle, rightContent, children } = props;
    const pathname = usePathname();
    const theme = useTheme();

    useEffect(() => {
        document.title = `${resolveWindowTitleFromPathName(pathname)} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`;
    }, [title, subtitle, children]);

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

    return (
        <PageContainer>
            <Stack
                direction={"row"}
                spacing={"var(--space-3)"}
                justifyContent={"space-between"}
                justifyItems={"space-between"}
                alignItems={"center"}
                alignContent={"center"}
            >
                <TitleAndSubtitleContainer
                    component="div"
                    titleispresent={title ? "true" : "false"}
                    bgcolor={theme.vars.palette.background.body}
                >
                    <Typography level="h2">{title}</Typography>
                    <Typography level="title-sm">{subtitle}</Typography>
                </TitleAndSubtitleContainer>
                {rightContent ?
                    <Stack direction={"row"} spacing={"var(--space-3)"}>
                        {rightContent}
                    </Stack> : null
                }
            </Stack>
            <Box component="main">{children}</Box>
        </PageContainer>
    );
};
const PageContainer = styled(Box)``;

const TitleAndSubtitleContainer = styled(Box)<{ titleispresent: "true" | "false", bgcolor: string }>`
    display: grid;
    gap: var(--gap-1);
    padding: 0 0 var(--gap-2) 0;
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: ${(props) => props.bgcolor};
    padding-top: ${(props) => props.titleispresent === "true" ? "var(--gap-4)" : "unset"};
`;
