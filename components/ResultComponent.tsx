"use client";
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, Input, Menu, MenuItem, Stack, Typography} from "@mui/joy";
import {SemesterSelectionComponent} from "@/components/shared/SemesterSelectionComponent";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Ergebnis} from "@/api/ergebnis";
import {Interaktion} from "@/api/interaktion";
import {Spieler, SpielerListPage} from "@/api/spieler";
import {
    AufgabeId,
    CleanResult,
    convertToTimeUnit,
    DEFAULT_INITIAL_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    exportResult,
    getTimeUnitShorthand,
    Pagination,
    PaginationConfig
} from "@/contexts/ApplicationContext";
import {ResultsTableComponent} from "@/components/ResultsTableComponent";
import {Kommentar} from "@/api/kommentar";
import {Status} from "@/api/status";
import exportFromJSON from "export-from-json";
import {createPortal} from "react-dom";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import SearchInputComponent from "@/components/shared/SearchInputComponent";

export const ResultComponent: React.FC = () => {
    const { semester } = useApplicationContext();
    const { isSmall } = useMediaQuery();
    const exportButtonPortalRef = useRef<HTMLDivElement>();
    const searchInputPortalRef = useRef<HTMLDivElement>();

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
                <Box component="div" sx={{ justifySelf: "flex-start" }}>
                    {/*<SemesterSelectionComponent />*/}
                    <Box id={"searchInputPortalRef"} ref={searchInputPortalRef} component="div" sx={{ display: "grid" }}></Box>
                </Box>
                <Box sx={{ justifySelf: "flex-end" }}>
                    <Box id={"exportButtonPortalRef"} ref={exportButtonPortalRef} component="div" sx={{ display: "grid" }}></Box>
                </Box>
            </Stack>
            {semester ?
                <ResultWrapperComponent semesterId={semester.id}>
                    {(cleanResults, paginationConfig) =>
                        <ResultWrapperContent
                            cleanResults={cleanResults}
                            paginationConfig={paginationConfig}
                        />
                    }
                </ResultWrapperComponent> :
                <Alert color="warning">Wählen Sie erst ein Semester aus </Alert>
            }
        </Stack>
    );
};

type PropsResultWrapper = {
    semesterId: string;
    children: (cleanResults: CleanResult[], paginationConfig: PaginationConfig) => void;
};
const ResultWrapperComponent: React.FC<PropsResultWrapper> = (props) => {
    const { semesterId, children } = props;
    const {
        timeUnit,
        numberDecimalPlace,
        getErgebnisBySemesterId,
        getInteraktionBySpielerId,
        getSpielerListBySemesterId,
        getKommentareBySemesterId,
        getStatusBySemesterId,
    } = useApplicationContext();
    const [interactionList, setInteractionList] = useState<Interaktion[] | undefined>(undefined);
    const [spielerListPage, setSpielerListPage] = useState<SpielerListPage | undefined>(undefined);
    const [kommentarList, setKommentarList] = useState<Kommentar[] | undefined>(undefined);
    const [statusList, setStatusList] = useState<Status[] | undefined>(undefined);

    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: DEFAULT_INITIAL_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
    });

    const {
        data: ergebnisList,
        isLoading: isLoadingErgebnis,
        error: errorErgebnis,
    } = useSWR<Ergebnis[]>(`getErgebnisBySemesterId-${semesterId}`, async () => await getErgebnisBySemesterId(semesterId));

    useEffect(() => {
        const loadInteractions = async () => {
            if (!ergebnisList) return;
            // TODO: Replace this with a new API -> getInteraktionBySemesterId (Add this new API on the Backend)
            const loadedInteractions = await Promise.all(
                ergebnisList
                    .map((e) => e.spielerId)
                    // Removing duplicate spieler IDs
                    .reduce((acc: string[], curr: string) => acc.find((s) => s === curr) ? acc : [...acc, curr],[])
                    .map((id) => getInteraktionBySpielerId(id))
            );
            const flatListOfLoadedInteractions = loadedInteractions.flat();
            setInteractionList(flatListOfLoadedInteractions);
        }

        loadInteractions();
    }, [ergebnisList]);

    useEffect(() => {
        if (!semesterId) return;

        const loadSpieler = async () => {
            const loadedSpieler = await getSpielerListBySemesterId(
                semesterId,
                pagination.pageNumber,
                pagination.pageSize,
            );
            setSpielerListPage(loadedSpieler);
        }

        const loadKommentare = async () => {
            const loadedKommentare = await getKommentareBySemesterId(semesterId);
            setKommentarList(loadedKommentare);
        }

        const loadStatus = async () => {
            const loadedStatus = await getStatusBySemesterId(semesterId);
            setStatusList(loadedStatus);
        }

        loadSpieler();
        loadKommentare();
        loadStatus();
    }, [semesterId, pagination]);

    const resolveNumberOfInteractionOfPlayerInRoom = (playerId: string, aufgabeId: string): string => {
        if (!interactionList) return "";
        const interactionsOfPlayer = interactionList.filter((i) => i.spielerId === playerId && i.aufgabeId === aufgabeId);

        if (interactionsOfPlayer.length === 0) return "";
        return interactionsOfPlayer.length.toString();
    }

    const resolveTimeSpentInRoomOfPlayer = (playerId: string, aufgabeId: string): string => {
        if (!ergebnisList) return "";
        const resultOfPlayer = ergebnisList.filter((e) => e.spielerId === playerId && e.aufgabeId === aufgabeId);

        if (resultOfPlayer.length === 0) return "";

        const playTime = resultOfPlayer
            .filter((e) => e.geloestIn !== null &&  e.geloestIn !== undefined)
            .map((e) => e.geloestIn as number)
            .reduce((acc, curr) => acc + curr, 0);

        return `${convertToTimeUnit(playTime, timeUnit).toFixed(numberDecimalPlace)} ${getTimeUnitShorthand(timeUnit)}`;
    }

    const resolveTotalPlayTimeOfPlayer = (playerId: string): string => {
        if (!ergebnisList) return "";
        const resultsOfPlayer = ergebnisList.filter((e) => e.spielerId === playerId);

        if (resultsOfPlayer.length === 0) return "";

        const playTimeFromResult = resultsOfPlayer
            .filter((e) => e.geloestIn !== null &&  e.geloestIn !== undefined)
            .map((e) => e.geloestIn as number)
            .reduce((acc, curr) => acc + curr, 0);

        return `${convertToTimeUnit(playTimeFromResult, timeUnit).toFixed(numberDecimalPlace)} ${getTimeUnitShorthand(timeUnit)}`;
    }

    const resolveTriesPerTaskOfPlayer = (playerId: string, aufgabeId: string): string => {
        if (!ergebnisList) return "";
        const resultsOfPlayer = ergebnisList.filter((e) => e.spielerId === playerId && e.aufgabeId === aufgabeId);

        if (resultsOfPlayer.length === 0) return "";

        return resultsOfPlayer.length.toString();
    }

    const resolveKommentareOfPlayer = (playerId: string): string[] => {
        if (!kommentarList) return [];
        const kommentareOfPlayer = kommentarList.filter((k) => k.spielerId === playerId);

        if (kommentareOfPlayer.length === 0) return [];

        return kommentareOfPlayer.map((k) => k.inhalt);
    }

    const resolveStatusOfPlayer = (playerId: string): string => {
        if (!statusList) return "";
        const statusOfPlayer = statusList.find((s) => s.spielerId === playerId);

        if (!statusOfPlayer) return "";

        return statusOfPlayer.istSpielBeendet ? "Beendet" : "Nicht Beendet";
    }

    const computeCleanResults = useCallback((): CleanResult[] => {
        const spielerList: Spieler[] | undefined = spielerListPage?.pageContent;
        if (!spielerList || spielerList.length === 0) return [];

        return spielerList.map((s) => ({
            spielerId: s.spielerId,
            idOfPlayer: s.id,
            interactionPerRoom: {
                room1: resolveNumberOfInteractionOfPlayerInRoom(s.id, AufgabeId.AUFGABE_1),
                room2: resolveNumberOfInteractionOfPlayerInRoom(s.id, AufgabeId.AUFGABE_2),
                room3: resolveNumberOfInteractionOfPlayerInRoom(s.id, AufgabeId.AUFGABE_3),
                room4: resolveNumberOfInteractionOfPlayerInRoom(s.id, AufgabeId.AUFGABE_4),
                room5: resolveNumberOfInteractionOfPlayerInRoom(s.id, AufgabeId.AUFGABE_5),
                room6: resolveNumberOfInteractionOfPlayerInRoom(s.id, AufgabeId.AUFGABE_6),
            },
            timeSpentPerRoom: {
                room1: resolveTimeSpentInRoomOfPlayer(s.id, AufgabeId.AUFGABE_1),
                room2: resolveTimeSpentInRoomOfPlayer(s.id, AufgabeId.AUFGABE_2),
                room3: resolveTimeSpentInRoomOfPlayer(s.id, AufgabeId.AUFGABE_3),
                room4: resolveTimeSpentInRoomOfPlayer(s.id, AufgabeId.AUFGABE_4),
                room5: resolveTimeSpentInRoomOfPlayer(s.id, AufgabeId.AUFGABE_5),
                room6: resolveTimeSpentInRoomOfPlayer(s.id, AufgabeId.AUFGABE_6),
            },
            totalPlayTime: resolveTotalPlayTimeOfPlayer(s.id),
            triesPerTask: {
                room1: resolveTriesPerTaskOfPlayer(s.id, AufgabeId.AUFGABE_1),
                room2: resolveTriesPerTaskOfPlayer(s.id, AufgabeId.AUFGABE_2),
                room3: resolveTriesPerTaskOfPlayer(s.id, AufgabeId.AUFGABE_3),
                room4: resolveTriesPerTaskOfPlayer(s.id, AufgabeId.AUFGABE_4),
                room5: resolveTriesPerTaskOfPlayer(s.id, AufgabeId.AUFGABE_5),
                room6: resolveTriesPerTaskOfPlayer(s.id, AufgabeId.AUFGABE_6),
            },
            hasFinishedGame: resolveStatusOfPlayer(s.id),
            comments: resolveKommentareOfPlayer(s.id),
        }));
    }, [spielerListPage, interactionList, kommentarList, statusList]);

    const paginationConfig: PaginationConfig = {
        ...spielerListPage!,
        onChangePage: (pageNumber: number) => setPagination((prev) => ({ ...prev, pageNumber })),
        onChangeRowsPerPage: (pageSize: number) => setPagination((prev) => ({ ...prev, pageSize })),
    };

    if (isLoadingErgebnis ||
        !ergebnisList ||
        !interactionList ||
        !spielerListPage
    ) return <Alert>Wird geladen...</Alert>

    if (errorErgebnis) return <Alert color="danger">{(errorErgebnis as Error).message}</Alert>

    return (
        <>
            {children ? children(computeCleanResults(), paginationConfig) : null}
        </>
    );
};

type PropsResultWrapperContent = {
    cleanResults: CleanResult[];
    paginationConfig: PaginationConfig;
}
const ResultWrapperContent: React.FC<PropsResultWrapperContent> = (props) => {
    const { cleanResults, paginationConfig, } = props;
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const [cleanResultsToShow, setCleanResultsToShow] = useState<CleanResult[]>([]);

    useEffect(() => {
        setCleanResultsToShow(cleanResults);
    }, [cleanResults]);

    const handleExport = (results: CleanResult[], format: keyof typeof exportFromJSON.types) => {
        exportResult(results, "ergebnisse", format);
    }

    const handleSearchInputValueChange = (event: any) => {
        event?.stopPropagation();
        event?.preventDefault();
        const value = event.target.value;

        setSearchInputValue(value);
        const filteredResults = cleanResults.filter((result) =>
            result.spielerId.toLowerCase().includes(value.toLowerCase())
        );
        setCleanResultsToShow(filteredResults);
    }

    const resetSearch = () => {
        setCleanResultsToShow(cleanResults);
        setSearchInputValue("");
    }

    return (
        <>
            {cleanResultsToShow.length === 0 ?
                <Alert color={"warning"} size="lg" sx={{ borderRadius: "md" }}>
                    <div>
                        <Typography level="title-lg" sx={{mb: 1 }}>Keine Ergebnisse gefunden</Typography>
                        <Typography level="body-md">
                            Der Spieler mit der eingegebenen Spieler-ID hat entweder noch nicht gespielt oder existiert
                            nicht!.
                        </Typography>
                        <Button
                            sx={{ mt: 2, borderRadius: "md" }}
                            onClick={resetSearch}
                        >
                            Zurück zu den Datensätzen
                        </Button>
                    </div>
                </Alert>
                :
                <>
                    <ResultsTableComponent
                        results={cleanResultsToShow}
                        paginationConfig={paginationConfig}
                    />
                    {createPortal(
                        <Dropdown>
                            <MenuButton endDecorator={<ArrowDropDown />}>Exportieren</MenuButton>
                            <Menu component="div">
                                <MenuItem onClick={() => handleExport(cleanResults, exportFromJSON.types.csv)}>
                                    Als .csv exportieren
                                </MenuItem>
                                <MenuItem onClick={() => handleExport(cleanResults, exportFromJSON.types.xls)}>
                                    Als .xls exportieren
                                </MenuItem>
                            </Menu>
                        </Dropdown>,
                        document.getElementById("exportButtonPortalRef") as Element
                    )}
                    {createPortal(
                        <SearchInputComponent value={searchInputValue} onChange={handleSearchInputValueChange} />,
                        document.getElementById("searchInputPortalRef") as Element
                    )}
                </>
            }
        </>
    )
}
