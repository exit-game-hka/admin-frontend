"use client";
import React, {ReactNode, useState} from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import styled from "styled-components";
import {Box, Divider} from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import {usePathname, useRouter} from "next/navigation";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {v4 as uuid} from "uuid";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import SportsKabaddiOutlinedIcon from '@mui/icons-material/SportsKabaddiOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import MenuIcon from "@mui/icons-material/Menu";

const INITIAL_SIDEBAR_STATE = true;

/**
 * Typ für Schaltflächen in der Seitenleiste.
 */
type NavigationButton = {
    label: string;
    icon: ReactNode;
    isActive?: boolean | undefined;
    endAction?: ReactNode | undefined;
    onClick: () => void;
};

type Props = {
    isMobile?: boolean |undefined;
    onButtonClick?: () => void;
}
/**
 * React-Komponente für die Seitenleiste der Anwendung.
 */
const SidebarComponent: React.FC<Props> = (props) => {
    const { isMobile, onButtonClick } = props;
    const [isOpen, setIsOpen] = useState<boolean>(INITIAL_SIDEBAR_STATE);
    const router = useRouter();
    const pathname = usePathname();
    const { isSmall } = useMediaQuery();

    // useEffect(() => {
    //     if (!isSmall && isMobile) {
    //         setIsOpen(true);
    //         return;
    //     }
    //     setIsOpen(false);
    // }, [isMobile, isSmall]);

    const handleClick = (path: string) => {
        router.push(path);
        if (!onButtonClick) return;
        onButtonClick()
    }

    const upperButtons: NavigationButton[] = [
        {
            label: "Startseite",
            icon: <DashboardOutlinedIcon />,
            isActive: pathname === "/",
            onClick: () => handleClick("/"),
        },
        {
            label: "Semester",
            icon: <SchoolOutlinedIcon />,
            isActive: pathname === "/semester",
            onClick: () => handleClick("/semester"),

        },
        {
            label: "Veranstaltungen",
            icon: <SportsEsportsOutlinedIcon />,
            isActive: pathname.includes("/lessons"),
            onClick: () => handleClick("/lessons"),
        },
        {
            label: "Spieler",
            icon: <SportsKabaddiOutlinedIcon />,
            isActive: pathname.includes("/players"),
            onClick: () => handleClick("/players"),
        },
        // {
        //     label: "Räume",
        //     icon: <MeetingRoomOutlinedIcon />,
        //     isActive: pathname.includes("/rooms"),
        //     onClick: () => handleClick("/rooms"),
        // },
        {
            label: "Ergebnisse",
            icon: <AssessmentOutlinedIcon />,
            isActive: pathname.includes("/results"),
            onClick: () => handleClick("/results"),
        },
    ];

    const lowerButtons: NavigationButton[] = [
        {
            label: "Einstellungen",
            icon: <SettingsOutlinedIcon />,
            isActive: pathname.includes("/settings"),
            onClick: () => handleClick("/settings"),
        },
        ...(isMobile ? [] : [
            {
                label: "Seitenleiste ausklappen",
                icon: isOpen ? (
                    <KeyboardDoubleArrowLeftOutlinedIcon />
                ) : (
                    <KeyboardDoubleArrowRightOutlinedIcon />
                ),
                onClick: () => setIsOpen((prevState) => !prevState),
            }
        ]),
    ];

    return (
        <SidebarWrapper>
            <SidebarContainer>
                <UpperButtonListContainer>
                    <ButtonListComponent
                        key={uuid()}
                        buttons={upperButtons}
                        showLabel={isOpen}
                    />
                </UpperButtonListContainer>
                <ButtonListComponent
                    key={uuid()}
                    buttons={lowerButtons}
                    showLabel={isOpen}
                />
            </SidebarContainer>
            <Divider orientation={"vertical"} />
        </SidebarWrapper>
    );
};
type PropsButtonList = {
    buttons: NavigationButton[];
    showLabel: boolean;
};
const ButtonListComponent: React.FC<PropsButtonList> = (
    props: PropsButtonList,
) => {
    const { buttons, showLabel } = props;

    return (
        <List component={"aside"} size={"md"}>
            {buttons.map((button, index) => (
                <ListItem
                    key={`${button.label}${index}`}
                    onClick={button.onClick}
                    endAction={button.endAction}
                    sx={{
                        "& *": button.isActive ? {
                            backgroundColor: theme => button.isActive ? `${theme.vars.palette.primary[500]} !important` : "initial",
                            color: "white !important",
                        } : {}
                    }}
                >
                    <StyledListItemButton
                        selected={button.isActive}
                    >
                        <ListItemDecorator
                            sx={{
                                ...(!showLabel ? {
                                    minInlineSize: "unset",
                                    "-webkit-margin-end": "unset",
                                    marginInlineEnd: "unset",
                                }: {}),
                            }}
                        >
                            {button.icon}
                        </ListItemDecorator>
                        {showLabel ? button.label : null}
                    </StyledListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export const SidebarOnMobileComponent: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <React.Fragment>
            <MenuIcon onClick={() => setIsOpen(!isOpen)}/>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <ModalDialog layout={"fullscreen"}>
                    <ModalClose />
                    <DialogTitle>{process.env.NEXT_PUBLIC_APPLICATION_NAME}</DialogTitle>
                    <SidebarComponent isMobile={true} onButtonClick={() => setIsOpen(false)} />
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}

const SidebarWrapper = styled(Box)`
    display: grid;
    grid-template-columns: 1fr max-content;
    height: 100%;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
`;
const SidebarContainer = styled(Box)`
    display: grid;
    gap: var(--gap-1);
    grid-template-rows: 1fr max-content;
    padding: var(--gap-1);
`;
const UpperButtonListContainer = styled(Box)`
    display: grid;
    gap: var(--gap-1);
    align-content: start;
    align-items: start;
`;
const StyledListItemButton = styled(ListItemButton)`
    border-radius: var(--border-small);
    padding: var(--gap-1);
`;

export default SidebarComponent;
