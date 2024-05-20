"use client";
import React, {PropsWithChildren} from 'react';
import {Stack} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type Props = PropsWithChildren;

export const FormContainerComponent: React.FC<Props> = (props) => {
    const { children } = props;
    const { isSmall } = useMediaQuery();

    return (
        <Stack spacing={"var(--gap-3)"} sx={{ width: isSmall ? "100%" : "600px" }}>
            {children}
        </Stack>
    );
};

