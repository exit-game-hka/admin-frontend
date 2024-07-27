"use client";
import React from "react";
import {Box, Divider, Stack, useTheme} from "@mui/joy";
import ViewSwitcherComponent from "@/app/rooms/(shared)/ViewSwitcherComponent";
import {Raum} from "@/api/raum";
import AspectRatioThumbnailContainerComponent from "@/app/rooms/(shared)/AspectRatioThumbnailContainerComponent";
import {resolveThumbnail} from "@/app/rooms/(shared)/utils";
import Typography from "@mui/joy/Typography";
import styled from "styled-components";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {useRouter} from "next/navigation";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";

const RoomListComponent: React.FC = () => {
    const { isSmall } = useMediaQuery();
    const router = useRouter();
    const { getAllRooms } = useApplicationContext();

    const {
        data: rooms,
        isLoading,
        error,
    } = useSWR<Raum[]>("getAllRooms", getAllRooms);

    const navigateToGameScene = (e: any, roomId: string) => {
        e?.preventDefault();
        router.push(`/rooms/${roomId}`);
    }

    if (isLoading || !rooms) return <div>Räume werden geladen...</div>;

    if (error) return <div>{`Ein Fehler ist aufgetreten: ${(error as Error).toString()}`}</div>;

    return (
        <ViewSwitcherComponent>
            {(view) =>
                view === "GRID" ?
                    <RoomListContainer small={`${isSmall}`}>
                        {rooms.map((room, index) =>
                            <GridViewComponent
                                key={`${room.name}${index}`}
                                room={room}
                                onClick={(e) => navigateToGameScene(e, room.id)}
                            />
                        )}
                    </RoomListContainer>
                    :
                    <Stack spacing={1}>
                        {rooms.map((room, index, arr) =>
                            <React.Fragment key={`${room.name}${index}`}>
                                <ListViewComponent
                                    room={room}
                                    onClick={(e) => navigateToGameScene(e, room.id)}
                                />
                                {index === arr.length - 1 ? null : <Divider />}
                            </React.Fragment>
                        )}

                    </Stack>
            }
        </ViewSwitcherComponent>
    );
};

type PropsView = {
    room: Raum;
    onClick: (event: any) => void;
}
const GridViewComponent: React.FC<PropsView> = (props) => {
    const { room, onClick } = props;

    return (
        <RoomItemContainer onClick={onClick}>
            <AspectRatioThumbnailContainerComponent
                alt={`${room.name}`}
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/thumbnails/${resolveThumbnail(room)}`}
            />
            <RoomLabelContainer component={"div"}>
                <Typography level="title-md">{room.name}</Typography>
                <Typography level="body-sm">{room.beschreibung}</Typography>
            </RoomLabelContainer>
        </RoomItemContainer>
    );
};
const ListViewComponent: React.FC<PropsView> = (props) => {
    const { room, onClick } = props;
    const theme = useTheme();

    return (
        <>
            <Box
                component={"div"}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "minmax(150px, 400px) 1fr",
                    p: 2,
                    borderRadius: "md",
                    "&:hover": {
                        cursor: "pointer",
                        backgroundColor: `${theme.vars.palette.primary.solidHoverBg}`,
                        "& *": {
                            color: "white",
                        }
                    },
                }}
                onClick={onClick}
            >
                <AspectRatioThumbnailContainerComponent
                    alt={`${room.name}`}
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/thumbnails/${resolveThumbnail(room)}`}
                />
                <div style={{ paddingTop: "var(--gap-1)" }}>
                    <RoomLabelContainer component={"div"}>
                        <Typography level="title-md">{room.name}</Typography>
                        <Typography level="body-sm">{room.beschreibung}</Typography>
                    </RoomLabelContainer>
                </div>
            </Box>
        </>
    );
}

const RoomListContainer = styled(Box)<{ small: "true" | "false" }>`
    display: grid;
    grid-template-columns: ${(props) => props.small === "true" ? "1fr" : "repeat(3, 1fr)"};
    grid-column-gap: var(--gap-6);
    margin-top: var(--gap-3);
`;
const RoomItemContainer = styled(Box)`
    display: grid;
    grid-gap: var(--gap-1);
    margin-bottom: var(--gap-6);
    padding: 0 10px;
`;
const RoomLabelContainer = styled(Box)`
    padding: 0 var(--gap-2) 0 var(--gap-2);
`;

export default RoomListComponent;
