"use client";
import React, {PropsWithChildren, ReactNode, useEffect} from "react";
import styled from "styled-components";
import {Box, Stack, Typography, useTheme} from "@mui/joy";
import {usePathname, useRouter} from "next/navigation";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CHARACTERS_TO_EXCLUDE_FROM_URL = ["/", "-", "\\", "[", "]"] as const;

type Props = PropsWithChildren & {
    title?: string;
    subtitle?: string;
    rightContent?: ReactNode;
    hideBackButton?: boolean;
};

export const PageWrapperComponent: React.FC<Props> = (props) => {
    const { title, subtitle, rightContent, hideBackButton, children } = props;
    const pathname = usePathname();
    const theme = useTheme();
    const { isSmall } = useMediaQuery();
    const router = useRouter();

    useEffect(() => {
        const resolveWindowTitleFromPathName = (pathname: string): string => {
            if (!pathname) return "";
            let result = pathname === "/" ? "Startseite" : pathname.slice(1);

            CHARACTERS_TO_EXCLUDE_FROM_URL.forEach((character) => {
                if (!result.includes(character)) return;

                const cleanText = result.replaceAll(character, " ");
                result = cleanText.slice(0);
            });

            return `${result.charAt(0).toUpperCase()}${result.slice(1)}`;
        };
        document.title = `${resolveWindowTitleFromPathName(pathname)} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`;
    }, [title, subtitle, children, pathname]);

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
                    paddingTop: title ? "var(--gap-3)" : "unset",
                }}
            >
                <TitleAndSubtitleContainer
                    component="div"
                    bgcolor={theme.vars.palette.background.body}
                >
                    <Stack spacing="5px" alignContent="flex-start" alignItems="flex-start">
                        {hideBackButton ? null : <BackButtonComponent onClick={router.back} />}
                        <Typography level="h2">{title}</Typography>
                    </Stack>
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

type PropsBackButton = {
    onClick: () => void;
}
const BackButtonComponent: React.FC<PropsBackButton> = (props) => {
    const { onClick } = props;
    return (
        <Stack
            direction="row"
            spacing="5px"
            alignItems="center"
            alignContent="center"
            onClick={onClick}
            sx={{
                "&:hover": {
                    cursor: "pointer",
                },
            }}
        >
            <ArrowBackIcon sx={{ color: "var(--color-primary)" }} />
            <Typography level="body-md" sx={{ color: "var(--color-primary)", fontWeight: 600 }}>Zurück</Typography>
        </Stack>
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
