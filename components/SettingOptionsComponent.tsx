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
import {Typography, useColorScheme} from "@mui/joy";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import Autocomplete from '@mui/joy/Autocomplete';
import {Mode} from "@mui/system/cssVars/useCurrentColorScheme";

type GroupName = "Benutzer-Infos" | "Darstellung" | "Anzeige" | "Über die Anwendung";
const SettingOptionsComponent: React.FC = () => {
    const {isSmall} = useMediaQuery();
    const { mode, setMode } = useColorScheme();

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
                }}>admin@acme.com</Typography>,
            },
            {
                icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
                label: "Role",
                value: "Admin",
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
                        value={mode === "dark" ? modeOptions[0] : modeOptions[1]}
                        options={modeOptions}
                        getOptionLabel={(o) => o.label}
                        onChange={(_, newValue) => setMode(newValue?.value as Mode)}
                        sx={{ width: isSmall ? 100 : 200, mr: -1 }}
                    />
                ),
            },
            {
                icon: <WatchLaterOutlinedIcon fontSize="small" />,
                label: "Zeiteinheit",
                value: "Minuten",
            },
            {
                icon: <NumbersOutlinedIcon fontSize="small" />,
                label: "Nachkommastellen",
                value: "keine",
            },
        ],
    };

    const illustration: Group<GroupName> = {
        name: "Anzeige",
        items: [
            {
                icon: <LanguageOutlinedIcon fontSize="small" />,
                label: "Sprache",
                value: "Deutsch",
            },
            {
                icon: <TravelExploreOutlinedIcon fontSize="small" />,
                label: "Zeitzone",
                value: "Europe/Berlin",
            },
        ],
    };

    const aboutTheApp: Group<GroupName> = {
        name: "Über die Anwendung",
        items: [
            {
                icon: <AppsOutlinedIcon fontSize="small" />,
                label: "Bezeichung",
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
                value: "#27",
            },
            {
                icon: <NewReleasesOutlinedIcon fontSize="small" />,
                label: "Version",
                value: "1.0.0",
            },
        ],
    };

    const allGroups: Group<GroupName>[] = [userInfo, display, illustration, aboutTheApp];

    return (
        <DetailsListComponent groups={allGroups} />
    );
};

export default SettingOptionsComponent;
