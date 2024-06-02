"use client";
import {signOut, useSession} from "next-auth/react";
import React, {useEffect} from "react";
import axios from "axios";
import {Avatar, Stack, Typography} from "@mui/joy";
import {Session} from "next-auth";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

const keycloakSessionLogOut = async () => {
    try {
        await axios.get(`${process.env.NEXTAUTH_URL}/api/auth/logout`);
    } catch (err) {
        console.error(err);
    }
};

const AuthStatusComponent: React.FC = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (
            status != "loading" &&
            session &&
            // @ts-ignore
            session?.error === "RefreshAccessTokenError"
        ) {
            signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_PATH! });
        }
    }, [session, status]);

    const handleLogout = async () => {
        await keycloakSessionLogOut();
        await signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_PATH! });
    };

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
                    <Menu sx={{
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
                        <MenuItem color="danger" onClick={handleLogout}>Abmelden</MenuItem>
                    </Menu>
                </Dropdown>
            </>
        );
    }

    return null;
}
export default AuthStatusComponent;
