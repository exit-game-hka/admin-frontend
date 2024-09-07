"use client";
import React from "react";
import {DetailsListComponent, Group} from "@/components/shared/DetailListComponent";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import {Button, Chip, Option, Select, Stack, Switch, Typography, useColorScheme} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {Mode} from "@mui/system/cssVars/useCurrentColorScheme";
import {useAuth} from "@/hooks/useAuth";
import useApplicationContext from "@/hooks/useApplicationContext";
import {NumberDecimalPlace, TableStripe, TimeUnit} from "@/contexts/ApplicationContext";
import {useNotificationContext} from "@/contexts/NotificationContext";
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';

type GroupName = "Benutzer-Infos" | "Darstellung" | "Mitteilungen" | "Anzeige" | "Über die Anwendung";

const modeOptions = [
    {label: "Dunkel", value: "dark"},
    {label: "Hell", value: "light"},
];

const SettingOptionsComponent: React.FC = () => {
    const {isSmall} = useMediaQuery();
    const { mode, setMode } = useColorScheme();
    const appContext = useApplicationContext();
    const notificationContext = useNotificationContext();
    const { signOut, data: session } = useAuth();

    const timeUnitOptions: ("Minuten" | "Stunden")[] = ["Minuten", "Stunden"];

    const decimalPlaceOptions: NumberDecimalPlace[] = [0, 1, 2];

    const tableStripeOptions = [
        { label: "Gerade Streifen", value: "even" },
        { label: "Ungerade Streifen", value: "odd" },
        { label: "Keine Streifen", value: undefined },
    ];

    const languageOptions: string[] = ["Deutsch"];

    const handleChangeMode = (e: any) => {
        if (!e || !e.target) return;
        const newMode = modeOptions.find((m) => m.label === e.target.innerText) ?? null;
        setMode(newMode?.value as Mode)
    };

    const handleChangeTimeUnit = (e: any) => {
        if (!e || !e.target) return;
        appContext.setTimeUnit(e.target.innerText as TimeUnit)
    };

    const handleChangeDecimalPlace = (e: any) => {
        appContext.setNumberDecimalPlace(parseInt(e.target.innerText) as NumberDecimalPlace);
    };

    const handleChangeTableStripe = (e: any) => {
        const newTableSTripe = tableStripeOptions.find((ts) => ts.label === e.target.innerText);
        appContext.setTableStripe(newTableSTripe?.value as TableStripe);
    };

    const userInfo: Group<GroupName> = {
        name: "Benutzer-Infos",
        items: [
            {
                icon: <AccountCircleOutlinedIcon fontSize="small" />,
                label: "Nutzername",
                value: <Typography sx={{
                    ...(isSmall ? {
                        width: "100px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } : {})
                }}>{session?.user?.name}</Typography>,
            },
            {
                icon: <AlternateEmailOutlinedIcon fontSize="small" />,
                label: "Email-Adresse",
                value: <Typography sx={{
                    ...(isSmall ? {
                        width: "100px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } : {})
                }}>{session?.user?.email}</Typography>,
            },
            {
                icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
                label: "Rollen",
                value: (
                    <Stack
                        direction={"row"}
                        spacing={0.5}
                        sx={{
                            maxWidth: isSmall ? "200px" : "unset",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            overflowX: isSmall ? "auto" : "hidden",
                        }}
                    >
                        {// @ts-ignore
                            session?.roles?.map((role) =>
                                <Chip size={"lg"} key={role} variant="outlined">{role}</Chip>
                            )
                        }
                    </Stack>
                ),
            },
            {
                icon: <ManageAccountsOutlinedIcon fontSize="small" />,
                label: "Session",
                value: <Button size="sm" color="danger" onClick={signOut}>Abmelden</Button>,
            },
        ],
        detail: `Nur Benutzer mit der Rolle "admin" können schreiben(Daten anlegen). Es kann keine Spieler, Semester, usw... angelegt werden, wenn die Rolle "admin" nicht besteht.`,
    };

    const display: Group<GroupName> = {
        name: "Darstellung",
        items: [
            {
                icon: <LightModeOutlinedIcon fontSize="small" />,
                label: "Modus",
                value: (
                    <Select
                        defaultValue={modeOptions.find(m => m.value === mode)?.label}
                        onChange={handleChangeMode}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    >
                        {modeOptions.map((mode) =>
                            <Option key={mode.value} value={mode.label} label={mode.label}>{mode.label}</Option>
                        )}
                    </Select>
                ),
            },
            {
                icon: <WatchLaterOutlinedIcon fontSize="small" />,
                label: "Zeiteinheit",
                value: (
                    <Select
                        defaultValue={appContext.timeUnit}
                        onChange={handleChangeTimeUnit}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    >
                        {timeUnitOptions.map((t) =>
                            <Option key={t} value={t}>{t}</Option>
                        )}
                    </Select>
                ),
            },
            {
                icon: <NumbersOutlinedIcon fontSize="small" />,
                label: "Nachkommastellen",
                value: (
                    <Select
                        defaultValue={appContext.numberDecimalPlace}
                        onChange={handleChangeDecimalPlace}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    >
                        {decimalPlaceOptions.map((dp) =>
                            <Option key={dp} value={dp}>{dp}</Option>
                        )}
                    </Select>
                ),
            },
            {
                icon: <TextureOutlinedIcon fontSize="small" />,
                label: "Tabellenstreifen",
                value: (
                    <Select
                        defaultValue={tableStripeOptions.find(ts => ts.value === appContext.tableStripe)?.label}
                        onChange={handleChangeTableStripe}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    >
                        {tableStripeOptions.map((ts) =>
                            <Option key={ts.value} value={ts.label} label={ts.label}>{ts.label}</Option>
                        )}
                    </Select>
                ),
            },
        ],
    };

    const illustration: Group<GroupName> = {
        name: "Anzeige",
        items: [
            {
                icon: <LanguageOutlinedIcon fontSize="small" />,
                label: "Sprache",
                value: (
                    <Select
                        defaultValue={"Deutsch"}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    >
                        {languageOptions.map((l) =>
                            <Option key={l} value={l}>{l}</Option>
                        )}
                    </Select>
                ),
            },
            {
                icon: <TravelExploreOutlinedIcon fontSize="small" />,
                label: "Zeitzone",
                value: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
        ],
    };

    const aboutTheApp: Group<GroupName> = {
        name: "Über die Anwendung",
        items: [
            {
                icon: <AppsOutlinedIcon fontSize="small" />,
                label: "Bezeichnung",
                value: <Typography sx={{
                    ...(isSmall ? {
                        width: "120px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } : {})
                }}>{process.env.NEXT_PUBLIC_APPLICATION_NAME}</Typography>,
            },
            {
                icon: <HandymanOutlinedIcon fontSize="small" />,
                label: "Build",
                value: process.env.NEXT_PUBLIC_BUILD_NUMBER ?? "",
            },
            {
                icon: <NewReleasesOutlinedIcon fontSize="small" />,
                label: "Version",
                value: process.env.NEXT_PUBLIC_APP_VERSION ?? "",
            },
        ],
    };

    const notifications: Group<GroupName> = {
        name: "Mitteilungen",
        items: [
            {
                icon: <NotificationsActiveOutlinedIcon fontSize="small" />,
                label: "Push-Benachrichtigungen",
                value: (
                    <Stack alignItems="center" alignContent="center">
                        <Switch
                            size="lg"
                            checked={notificationContext.hasSubscribed}
                            onClick={() => {
                                if (notificationContext.hasSubscribed) {
                                    notificationContext.unSubscribeToNotifications();
                                    return;
                                }
                                notificationContext.subscribeToNotifications();
                            }}
                        />
                    </Stack>
                ),
            },
            {
                icon: <VolumeUpOutlinedIcon fontSize="small" />,
                label: "Mitteilungston",
                value: (
                    <Stack alignItems="center" alignContent="center">
                        <Switch
                            disabled={!notificationContext.hasSubscribed}
                            size="lg"
                            checked={notificationContext.isNotificationSoundActive}
                            onClick={notificationContext.toggleNotificationSound}
                        />
                    </Stack>
                ),
            },
        ],
        detail: "Wenn aktiviert, werden Push-Benachrichtigungen 20 Sekunden lang angezeigt. Es wird kein Benachrichtigungston automatisch abgespielt, wenn die Push-Benachrichtigungen ausgeschaltet sind.",
    }

    const allGroups: Group<GroupName>[] = [userInfo, display, notifications, illustration, aboutTheApp];

    return (
        <DetailsListComponent groups={allGroups} />
    );
};

export default SettingOptionsComponent;
