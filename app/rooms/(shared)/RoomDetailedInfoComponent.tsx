"use client";
import React, {ChangeEvent, useState} from "react";
import {useParams} from "next/navigation";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Raum} from "@/api/raum";
import {Box, Button, Divider, Input, Stack, Typography} from "@mui/joy";
import AspectRatioThumbnailContainerComponent from "@/app/rooms/(shared)/AspectRatioThumbnailContainerComponent";
import {resolveThumbnail} from "@/app/rooms/(shared)/utils";
import {Aufgabe} from "@/api/aufgabe";
import {Loesung} from "@/api/loesung";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {DetailsListComponent, Group} from "@/components/shared/DetailListComponent";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import WifiTetheringErrorRoundedOutlinedIcon from "@mui/icons-material/WifiTetheringErrorRoundedOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {ADMIN_ROLE, useAuth} from "@/hooks/useAuth";

type AufgabeInfoGroupName = "Rätsel" | "Lösung" | "Beschreibung";

const RoomDetailedInfoComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: session } = useAuth();
    const { isSmall } = useMediaQuery();
    const { getRoomById } = useApplicationContext();
    const [showEditForm, setShowEditForm] = useState<boolean>(false);

    const {
        data: room,
        isLoading,
        error,
        mutate,
    } = useSWR<Raum>(`getRoomById-${id}`, async () => await getRoomById(id));

    const handleSave = async () => {
        await mutate();
        setShowEditForm(false);
    };

    const roomPreviewInfoList: { lable: string, value?: string }[] = [
        { lable: "Bezeichnung", value: room?.name },
        { lable: "Anzahl Rätsel", value: String(room?.aufgaben.length) },
        { lable: "Verwendet das Physik-Engine", value: "Ja" },
        { lable: "Status", value: "Aktiv" },
        { lable: "Beschreibung", value: room?.beschreibung },
    ];

    if (isLoading || !room) return <div>Raum wird geladen...</div>

    if (error) return <div>Fehler beim Laden des Raums: {error.message}</div>

    return (
        <Box
            component="div"
            sx={{
                display: "grid",
                gridTemplateColumns: isSmall ? "1fr" : "500px 1fr",
                gap: "var(--gap-5)",
                mt: 0.5,
            }}
        >
            <Stack
                spacing={"var(--gap-2)"}
                sx={{
                    pt: 0.5,
                }}
            >
                <AspectRatioThumbnailContainerComponent
                    alt={`${room.name}`}
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/thumbnails/${resolveThumbnail(room)}`}
                />
                <Stack spacing={4} sx={{ px: 1, pb: 2, pt: 1 }}>
                    <Typography level="h4" sx={{ mt: 1 }}>Übersicht</Typography>
                    <Stack spacing={"var(--gap-2)"}>
                        {roomPreviewInfoList.map((info, index, arr) =>
                            <React.Fragment key={info.lable}>
                                <Stack direction="row" spacing={2} sx={{ px: 1.5 }}>
                                    <Typography level={"body-sm"} sx={{ flexGrow: 1 }}>{info.lable}</Typography>
                                    <Typography level={"body-sm"}>{info.value}</Typography>
                                </Stack>
                                {index !== arr.length - 1 ? <Divider /> : null}
                            </React.Fragment>
                        )}
                    </Stack>
                </Stack>
                {// @ts-ignore
                    session?.roles?.includes(ADMIN_ROLE) ?
                    <Button disabled={showEditForm} onClick={() => setShowEditForm(true)}>
                        Bearbeiten
                    </Button>
                    :
                    null
                }
            </Stack>
            {showEditForm ?
                <EditTaskFormComponent
                    room={room}
                    onSave={handleSave}
                    onClose={() => setShowEditForm(false)}
                />
                :
                <RoomDetailComponent room={room} />
            }
        </Box>
    );
};

type PropsEditTaskForm = {
    room: Raum;
    onSave: () => void;
    onClose: () => void;
};
const EditTaskFormComponent: React.FC<PropsEditTaskForm> = (props) => {
    const { room, onSave, onClose } = props;
    const { isSmall } = useMediaQuery();
    const { updateRoom, updateAufgabe, updateLoesung } = useApplicationContext();

    const [aufgabe, setAufgabe] = useState<Aufgabe>(room.aufgaben[0]);
    const [loesung, setLoesung] = useState<Loesung>(room.aufgaben[0].loesungen[0]);

    const handleAufgabeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAufgabe(prevState => ({...prevState, [name]: value }));
    };

    const handleLoesungChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoesung(prevState => ({...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        await updateRoom(room);
        await updateAufgabe(aufgabe);
        await updateLoesung(loesung);
        onSave();
    }

    return (
        <Stack spacing={2.5} sx={{ mx: 1  }}>
            <Typography level="h4" sx={{ pb: 1.5, pt: 1 }}>Raum bearbeiten</Typography>
            <Stack spacing={"var(--gap-3)"}>
                <FormControl size="lg">
                    <FormLabel>Zeit zur Lösung in Minuten</FormLabel>
                    <Input
                        slotProps={{
                            input: {
                                name: "zeitZuLoesen",
                                component: "input",
                                value: aufgabe.zeitZuLoesen,
                                onChange: handleAufgabeChange,

                            }
                        }}
                    />
                </FormControl>
                <FormControl size="lg">
                    <FormLabel>Meldung bei erfolgreicher Antwort</FormLabel>
                    <Input
                        slotProps={{
                            input: {
                                name: "erfolgMeldung",
                                component: "textarea",
                                value: aufgabe.erfolgMeldung,
                                onChange: handleAufgabeChange,
                            }
                        }}
                    />
                </FormControl>
                <FormControl size="lg">
                    <FormLabel>Meldung bei falscher Antwort</FormLabel>
                    <Input
                        slotProps={{
                            input: {
                                name: "fehlschlagMeldung",
                                component: "textarea",
                                value: aufgabe.fehlschlagMeldung,
                                onChange: handleAufgabeChange,
                            }
                        }}
                    />
                </FormControl>
                <FormControl size="lg">
                    <FormLabel>Beschreibung der Aufgabe</FormLabel>
                    <Input
                        slotProps={{
                            input: {
                                name: "beschreibung",
                                component: "textarea",
                                value: aufgabe.beschreibung,
                                onChange: handleAufgabeChange,
                            }
                        }}
                    />
                </FormControl>
                <FormControl size="lg">
                    <FormLabel>Lösung</FormLabel>
                    <Input
                        slotProps={{
                            input: {
                                name: "wert",
                                component: "textarea",
                                value: loesung.wert,
                                onChange: handleLoesungChange,
                            }
                        }}
                    />
                </FormControl>
                <Stack direction={isSmall ? "column" : "row"} spacing={2}>
                    <Button onClick={handleSubmit}>
                        Änderungen speichern
                    </Button>
                    <Button color={"danger"} onClick={onClose}>
                        Änderungen verwerfen
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

type PropsRoomDetail = {
    room: Raum;
}
const RoomDetailComponent: React.FC<PropsRoomDetail> = (props) => {
    const { room } = props;
    const { isSmall } = useMediaQuery();

    const aboutTaskOfRoom: Group<AufgabeInfoGroupName> = {
        name: "Rätsel",
        items: [
            {
                icon: <AccessAlarmOutlinedIcon fontSize={"large"} />,
                label: "Zeit zur Lösung",
                value: `${room.aufgaben[0].zeitZuLoesen} Minuten`,
            },
            {
                icon: <CheckCircleOutlinedIcon fontSize={"large"} />,
                label: "Meldung bei erfolgreicher Antwort",
                value: (
                    <Typography noWrap sx={{ maxWidth: isSmall ? "150px" : "500px" }}>
                        {room.aufgaben[0].erfolgMeldung}
                    </Typography>
                ),
            },
            {
                icon: <WifiTetheringErrorRoundedOutlinedIcon fontSize={"large"} />,
                label: "Meldung bei falscher Antwort",
                value: (
                    <Typography noWrap sx={{ maxWidth: isSmall ? "150px" : "500px" }}>
                        {room.aufgaben[0].fehlschlagMeldung}
                    </Typography>
                ),
            }
        ],

    };
    const answersOfRoom: Group<AufgabeInfoGroupName> = {
        name: "Lösung",
        items: [
            {
                icon: <FlagOutlinedIcon fontSize={"large"} />,
                label: "Lösungswort",
                value: (
                    <Typography noWrap sx={{ maxWidth: isSmall ? "150px" : "500px" }}>
                        {room.aufgaben[0].loesungen[0].wert}
                    </Typography>
                ),
            },
        ],

    };
    const aboutTheRoom: Group<AufgabeInfoGroupName> = {
        name: "Beschreibung",
        items: [
            {
                icon: <DescriptionOutlinedIcon fontSize={"large"} />,
                label: "Beschreibung der Aufgabe",
                value: (
                    <Typography noWrap sx={{ maxWidth: isSmall ? "150px" : "500px" }}>
                        {room.aufgaben[0].beschreibung}
                    </Typography>
                ),
            },
        ],

    };
    const allInfoGroups: Group<AufgabeInfoGroupName>[] = [aboutTaskOfRoom, answersOfRoom, aboutTheRoom];

    return (
        <Stack spacing={4}>
            <Typography level="h4" sx={{ pb: 1.5, pt: 1 }}>Über den Raum</Typography>
            <DetailsListComponent groups={allInfoGroups} />
        </Stack>
    );
}

export default RoomDetailedInfoComponent;
