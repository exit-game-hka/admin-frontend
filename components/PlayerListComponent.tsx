"use client";
import React, {useEffect, useState} from 'react';
import {Alert, Box, Stack, TableProps, Typography} from "@mui/joy";
import useSWR from "swr";
import useApplicationContext from "@/hooks/useApplicationContext";
import {Spieler, SpielerListPage} from "@/api/spieler";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {Semester} from "@/api/semester";
import {Veranstaltung} from "@/api/veranstaltung";
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";
import {DEFAULT_INITIAL_PAGE_NUMBER, DEFAULT_PAGE_SIZE, Pagination} from "@/contexts/ApplicationContext";
import SearchInputComponent from "@/components/shared/SearchInputComponent";
import {useRouter} from "next/navigation";

type Props = {
    tableProps?: TableProps;
    limit?: number | undefined;
};

const PlayerListComponent: React.FC<Props> = (props) => {
    const { tableProps, limit } = props;
    const { getAllSpieler, getAllSemester, getAllVeranstaltungen } = useApplicationContext();
    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: DEFAULT_INITIAL_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const { isSmall } = useMediaQuery();
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const router = useRouter();

    const {
        data: spielerListPage,
        isLoading: isLoadingSpielerListPage,
        error: errorSpielerListPage,
    } = useSWR<SpielerListPage>(
        `getAllPlayer-${pagination.pageSize}${pagination.pageNumber}`,
        async () => await getAllSpieler(pagination.pageNumber, pagination.pageSize)
    );
    const [playersToShow, setPlayersToShow] = useState<Spieler[]>([]);

    useEffect(() => {
        if (!spielerListPage) return;
        const players = spielerListPage.pageContent
        setPlayersToShow(players);
    }, [spielerListPage]);

    const {
        data: semesters,
        isLoading: isLoadingSemesters,
        error: errorSemesters,
    } = useSWR<Semester[]>("getAllSemester", async () => await getAllSemester());

    const {
        data: veranstaltungen,
        isLoading: isLoadingVeranstaltungen,
        error: errorVeranstaltungen,
    } = useSWR<Veranstaltung[]>("getAllVeranstaltungen", async () => await getAllVeranstaltungen());

    const getSemester = (id: string): Semester => {
        return semesters?.find(s => s.id === id) as Semester;
    }

    const getVeranstaltung = (id: string): Veranstaltung => {
        return veranstaltungen?.find(s => s.id === id) as Veranstaltung;
    }

    const handleSearch = (event: any) => {
        event?.stopPropagation();
        event?.preventDefault();
        const value = event.target.value;

        if (!value) {
            resetSearch();
            return;
        }

        setSearchInputValue(value);
        const filteredPlayers = playersToShow.filter((player) =>
            player.spielerId.toLowerCase().includes(value.toLowerCase())
        );
        setPlayersToShow(filteredPlayers);
    }

    const resetSearch = () => {
        setPlayersToShow(spielerListPage?.pageContent ?? []);
        setSearchInputValue("");
    }

    if (
        isLoadingSpielerListPage ||
        isLoadingSemesters ||
        isLoadingVeranstaltungen ||
        !spielerListPage ||
        !semesters ||
        !veranstaltungen
    ) return <div>Wird geladen...</div>

    if (errorSpielerListPage) return <Alert color="danger">{(errorSpielerListPage as Error).message}</Alert>

    if (errorSemesters) return <Alert color="danger">{(errorSemesters as Error).message}</Alert>

    if (errorVeranstaltungen) return <Alert color="danger">{(errorVeranstaltungen as Error).message}</Alert>

    return (
        <Stack spacing={"var(--gap-4)"}>
            <Stack
                spacing={"var(--gap-2)"}
                sx={{
                    flexDirection: isSmall ? "column" : "row",
                    justifyItems: "space-between",
                    justifyContent: "space-between",
                    alignItems: isSmall ? "unset" : "center",
                    alignContent: isSmall ? "unset" : "center",
                }}
            >
                <SearchInputComponent value={searchInputValue} onChange={handleSearch} />
            </Stack>
            {playersToShow.length === 0 ?
                <Alert color={"warning"} size="lg" sx={{ borderRadius: "md" }}>
                    <div>
                        <Typography level="title-lg" sx={{mb: 1 }}>Keine Ergebnisse gefunden</Typography>
                        <Typography level="body-md">
                            Der Spieler mit der eingegebenen Spieler-ID hat entweder noch nicht gespielt oder existiert
                            nicht!.
                        </Typography>
                    </div>
                </Alert>
                :
                <CustomTableComponent
                    {...tableProps}
                    paginationConfig={{
                        pageNumber: spielerListPage.pageNumber,
                        pageSize: spielerListPage.pageSize,
                        totalPages: spielerListPage.totalPages,
                        totalElements: spielerListPage.totalElements,
                        isFirst: spielerListPage.isFirst,
                        isLast: spielerListPage.isLast,
                        onChangePage: (pageNumber: number) => setPagination((prev) => ({...prev, pageNumber })),
                        onChangeRowsPerPage: (pageSize: number) => setPagination((prev) => ({...prev, pageSize })),
                    }}
                    headerCells={
                        <Box component="tr">
                            <Box component="th" sx={{ width: "50px" }}></Box>
                            <Box component="th">Spieler-ID</Box>
                            {/*<Box component="th">Semester</Box>*/}
                            {/*{isSmall ?*/}
                            {/*    null :*/}
                            {/*    <Box component="th">Veranstaltung</Box>*/}
                            {/*}*/}
                        </Box>
                    }
                    bodyRows={playersToShow.slice(0, limit).map((spieler) => ({
                            onClick: () => router.push(`/results/${spieler.id}`),
                            content: (
                                <React.Fragment key={spieler.spielerId}>
                                    <Box component="td" sx={{ width: "50px" }}>
                                        <AccountCircleOutlinedIcon />
                                    </Box>
                                    <Box component="td">{spieler.spielerId}</Box>
                                    {/*<Box component="td">{getSemester(spieler.semesterId).bezeichnung}</Box>*/}
                                    {/*{isSmall ?*/}
                                    {/*    null :*/}
                                    {/*    <Box component="td">*/}
                                    {/*        {getVeranstaltung(spieler.veranstaltungId).bezeichnung} - {getVeranstaltung(spieler.veranstaltungId).name}*/}
                                    {/*    </Box>*/}
                                    {/*}*/}
                                </React.Fragment>
                            )
                        })
                    )}
                />
            }
        </Stack>
    );
};

export default PlayerListComponent;
