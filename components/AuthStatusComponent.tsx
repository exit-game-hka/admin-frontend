"use client";
import React from "react";
import {Avatar, Stack, Typography} from "@mui/joy";
import {Session} from "next-auth";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import {useAuth} from "@/hooks/useAuth";

const AuthStatusComponent: React.FC = () => {
    const { signOut, ...sessionData } = useAuth();
    const { data: session, status } = sessionData;

    const resolveUserAcronymFromSession = (session: Session): string => {
        if (!session.user?.name) return "";
        const names = session.user.name
            .toUpperCase()
            .split(" ");
        return `${names[0].charAt(0)}${names[1].charAt(0)}`;
    };

    if (status === "loading") return null;

    if (session) {
        return (
            <>
                <Dropdown sx={{ p: 0, m: 0 }}>
                    <MenuButton
                        slots={{ root: Avatar }}
                        slotProps={{ root: { variant: 'outlined' } }}
                    >
                        {resolveUserAcronymFromSession(session)}
                    </MenuButton>
                    <Menu component="div" sx={{
                        px: 1,
                        py: 2,
                        "& :nth-child(n)": {
                            borderRadius: "md",
                        },
                    }}
                    >
                        <MenuItem disabled>
                            <Stack direction="row" spacing="var(--gap-2)" sx={{ p: 0 }}>
                                <Avatar size="lg" variant="outlined">
                                    {resolveUserAcronymFromSession(session)}
                                </Avatar>
                                <Stack>
                                    <Typography level="title-lg">{session.user?.name}</Typography>
                                    <Typography level="body-sm">{session.user?.email}</Typography>
                                    <Typography level="body-sm">Admin</Typography>
                                </Stack>
                            </Stack>
                        </MenuItem>
                        <MenuItem color="danger" onClick={signOut}>Abmelden</MenuItem>
                    </Menu>
                </Dropdown>
            </>
        );
    }

    return null;
}
export default AuthStatusComponent;
