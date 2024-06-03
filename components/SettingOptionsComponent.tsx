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
import {Button, Typography, useColorScheme} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import Autocomplete from '@mui/joy/Autocomplete';
import {Mode} from "@mui/system/cssVars/useCurrentColorScheme";
import {useAuth} from "@/hooks/useAuth";
import useApplicationContext from "@/hooks/useApplicationContext";
import {NumberDecimalPlace, TimeUnit} from "@/contexts/ApplicationContext";

type GroupName = "Benutzer-Infos" | "Darstellung" | "Anzeige" | "Über die Anwendung";
const SettingOptionsComponent: React.FC = () => {
    const {isSmall} = useMediaQuery();
    const { mode, setMode } = useColorScheme();
    const appContext = useApplicationContext();
    const { signOut, data: session } = useAuth();

    const modeOptions = [
        {label: "Dunkel", value: "dark"},
        {label: "Hell", value: "light"},
    ];

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
                label: "Role",
                value: "Admin",
            },
            {
                icon: <ManageAccountsOutlinedIcon fontSize="small" />,
                label: "Session",
                value: <Button size="sm" color="danger" onClick={signOut}>Abmelden</Button>,
            },
        ],
        detail: "Nur Benutzer mit der Role Admin können schreiben(Daten anlegen). Es kann keine Spieler, Semester, usw... angelegt werden, wenn die Role Admin nicht besteht.",
    };

    const display: Group<GroupName> = {
        name: "Darstellung",
        items: [
            {
                icon: <LightModeOutlinedIcon fontSize="small" />,
                label: "Modus",
                value: (
                    <Autocomplete
                        size="sm"
                        value={mode === "dark" ? modeOptions[0] : modeOptions[1]}
                        options={modeOptions}
                        disableClearable={true}
                        getOptionLabel={(o) => o.label}
                        onChange={(_, newValue) => setMode(newValue?.value as Mode)}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    />
                ),
            },
            {
                icon: <WatchLaterOutlinedIcon fontSize="small" />,
                label: "Zeiteinheit",
                value: (
                    <Autocomplete
                        size="sm"
                        value={appContext.timeUnit}
                        disableClearable={true}
                        options={["Minuten", "Stunden"]}
                        onChange={(_, newValue) => appContext.setTimeUnit(newValue as TimeUnit)}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    />
                ),
            },
            {
                icon: <NumbersOutlinedIcon fontSize="small" />,
                label: "Nachkommastellen",
                value: (
                    <Autocomplete
                        size="sm"
                        value={appContext.numberDecimalPlace}
                        options={[0, 1, 2]}
                        disableClearable={true}
                        //getOptionLabel={(o) => o.label}
                        onChange={(_, newValue) => appContext.setNumberDecimalPlace(newValue as NumberDecimalPlace)}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    />
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
                    <Autocomplete
                        size="sm"
                        value={"Deutsch"}
                        options={["Deutsch"]}
                        disableClearable={true}
                        //getOptionLabel={(o) => o.label}
                        //onChange={(_, newValue) => setMode(newValue?.value as Mode)}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    />
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

    const allGroups: Group<GroupName>[] = [userInfo, display, illustration, aboutTheApp];

    return (
        <DetailsListComponent groups={allGroups} />
    );
};

export default SettingOptionsComponent;
