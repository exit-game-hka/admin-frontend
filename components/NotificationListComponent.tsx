"use client";
import React, {useEffect, useState} from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import useSWR from "swr";
import {Notification} from "@/api/notification";
import useApplicationContext from "@/hooks/useApplicationContext";
import {Alert, Badge, Box, Button, Card, Chip, Stack, Typography} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ListItem from "@mui/joy/ListItem";

const NotificationListComponent: React.FC = () => {
    const appContext = useApplicationContext();
    const { isSmall } = useMediaQuery();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {
        data: notifications,
        isLoading: isLoadingNotifications,
        error: errorNotifications,
        mutate: mutateNotifications,
    } = useSWR<Notification[]>(
        `getNotifications-${appContext.newNotification?.creationDate}`,
        appContext.getAllNotifications
    );

    useEffect(() => {
        if (!isOpen) return;
        appContext.setAllNotificationAsSeen();
        mutateNotifications();
    }, [isOpen]);

    const handleDeleteAllNotifications = async () => {
        await appContext.deleteAllNotifications();
        await mutateNotifications();
    }

    const handleDeleteNotificationById = async (id: string) => {
        await appContext.deleteNotificationById(id);
        await mutateNotifications();
    }

    if (isLoadingNotifications || !notifications) return null;

    if (errorNotifications) {
        console.error("Failed to load notifications: ", errorNotifications);
        return null;
    }

    return (
        <Dropdown open={isOpen} onOpenChange={() => setIsOpen(prev => !prev)}>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: {
                        variant: isOpen ? "solid" : "plain",
                        color: isOpen ? "primary" : "neutral"
                    }
                }}
            >
                <Badge badgeContent={notifications.filter((n) => !n.viewed).length} variant="solid" size="sm">
                    <NotificationsNoneOutlinedIcon />
                </Badge>
            </MenuButton>
            <Menu
                variant={isSmall ? "plain" : "outlined"}
                sx={{
                    maxWidth: isSmall ? "100dvw" : 450,
                    //maxHeight: isSmall ? "calc(100dvh - var(--appbar-min-height))" : "60dvh",
                    maxHeight: "calc(100dvh - var(--appbar-min-height))",
                    //height: isSmall ? "100%" : "auto",
                    height: "100%",
                    width: isSmall ? "100%" : "auto",
                }}
                onBlur={() => setIsOpen(prev => !prev)}
            >
                <Stack direction="row" spacing={"var(--gap-2)"} sx={{ mx: 1.5, my: 2 }} alignContent="flex-start" alignItems="flex-start">
                    <Box sx={{ flexGrow: 1, ml: 0.5 }}>
                        <Typography level="title-lg">Mitteilungszentrale</Typography>
                        {notifications.length > 0 ? <Typography level="body-xs">{notifications.length} Mitteilungen</Typography> : null}
                    </Box>
                    <Button size="sm" variant="plain" onClick={handleDeleteAllNotifications}>Alle entfernen</Button>
                </Stack>
                {notifications
                    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
                    .map((notification, index) =>
                        <ListItem
                            key={notification.id}
                        >
                            <Card
                                size="sm"
                                sx={{
                                    orderRadius: "lg",
                                    px: 1,
                                    py: 1,
                                    width: "100%",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={"var(--gap-1)"}
                                    alignContent="center"
                                    alignItems="center"
                                    sx={{ ml: 1, mt: 0.5 }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={"5px"}
                                        sx={{
                                            flexGrow: 1,
                                        }}
                                    >
                                        {!notification.viewed ?
                                            <Chip
                                                variant="solid"
                                                color="primary"
                                                sx={{ px: "1px", minWidth: "10px", minHeight: "10px", alignSelf: "center", justifySelf: "center" }}
                                            />
                                            : null
                                        }
                                        <Typography
                                            level="title-sm"
                                            fontWeight="bold"
                                        >
                                            {notification.title}
                                        </Typography>
                                    </Stack>
                                    <Typography level="body-xs">
                                        {new Date(notification.creationDate)
                                            .toLocaleDateString(
                                                [],
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: false,
                                                }
                                            )}
                                    </Typography>
                                    <IconButton variant="soft" size="sm" sx={{ borderRadius: "50%" }} onClick={() => handleDeleteNotificationById(notification.id)}>
                                        <DeleteOutlineOutlinedIcon sx={{ fontSize: "18px" }} />
                                    </IconButton>
                                </Stack>
                                <Typography
                                    level="body-sm"
                                    sx={{
                                        mb: 0.5,
                                        mx: 1,
                                    }}
                                >
                                    {notification.content}
                                </Typography>
                            </Card>
                        </ListItem>
                    )}
                {notifications.length === 0 ?
                    <ListItem>
                        <Alert
                            sx={{
                                mt: 0.5,
                                width: "100%",
                            }}
                        >
                            Keine Meitteilungen
                        </Alert>
                    </ListItem>
                    : null
                }
            </Menu>
        </Dropdown>
    );
}

export default NotificationListComponent;
