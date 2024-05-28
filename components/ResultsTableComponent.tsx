import React from "react";
import {Alert, Badge, Box, Typography} from "@mui/joy";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";
import {CleanResult} from "@/contexts/ApplicationContext";
import {useRouter} from "next/navigation";

type Props = {
    results: CleanResult[];
}
export const ResultsTableComponent: React.FC<Props> = (props) => {
    const { results } = props;
    const router = useRouter();

    const roomNumbers = [1, 2, 3, 4, 5, 6];
    const RoomNumbersHeaderCells = () => roomNumbers.map((n) => <Box key={n} component="th">{n}</Box>);

    return (
        <CustomTableComponent
            size="md"
            borderAxis="both"
            headerCells={
                <>
                    <Box component="tr">
                        <Box component="th" rowSpan={2} sx={{ width: "50px" }}></Box>
                        <Box component="th" rowSpan={2} sx={{ width: "145px" }}>Spieler-ID</Box>
                        <Box component="th" colSpan={6} sx={{ textAlign: "center !important" }}>
                            Anzahl Interaktionen pro Raum
                        </Box>
                        <Box component="th" colSpan={6} sx={{ textAlign: "center !important" }}>Dauer pro Raum</Box>
                        <Box component="th" rowSpan={2} sx={{ width: "130px" }}>Dauer insgesamt</Box>
                        <Box component="th" colSpan={6} sx={{ textAlign: "center !important" }}>
                            Anzahl Versuche pro Rätsel (Raum)
                        </Box>
                        <Box component="th" rowSpan={2} sx={{ width: "135px" }}>Spiel beendet</Box>
                        <Box component="th" rowSpan={2} sx={{ width: "18%" }}>Kommentare</Box>
                    </Box>
                    <Box
                        component="tr"
                        sx={{
                            "& th": {
                                textAlign: "center !important"
                            },
                        }}
                    >
                        <RoomNumbersHeaderCells />
                        <RoomNumbersHeaderCells />
                        <RoomNumbersHeaderCells />
                    </Box>
                </>

            }
            bodyRows={results.map((row) => ({
                onClick: () => router.push(`/results/${row.idOfPlayer}`),
                content: (
                    <React.Fragment key={row.spielerId}>
                        <Box component="td" sx={{ width: "50px", textAlign: "center !important" }}>
                            <AccountCircleOutlinedIcon />
                        </Box>
                        <Box component="td">{row.spielerId}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.interactionPerRoom.room1}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.interactionPerRoom.room2}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.interactionPerRoom.room3}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.interactionPerRoom.room4}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.interactionPerRoom.room5}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.interactionPerRoom.room6}</Box>

                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.timeSpentPerRoom.room1}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.timeSpentPerRoom.room2}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.timeSpentPerRoom.room3}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.timeSpentPerRoom.room4}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.timeSpentPerRoom.room5}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.timeSpentPerRoom.room6}</Box>

                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.totalPlayTime}</Box>

                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.triesPerTask.room1}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.triesPerTask.room2}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.triesPerTask.room3}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.triesPerTask.room4}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.triesPerTask.room5}</Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>{row.triesPerTask.room6}</Box>

                        <Box component="td" sx={{ textAlign: "center !important" }}>
                            {row.hasFinishedGame}
                        </Box>

                        <Box component="td">
                            {row.comments.length > 0 ?
                                <Alert sx={{ pr: row.comments.length > 1 ? 2 : 0 }}>
                                    <Typography noWrap sx={{ mr: row.comments.length > 1 ? 2 : 0 }}>{row.comments[0]}</Typography>
                                    {row.comments.length > 1 ?
                                        <Badge
                                            badgeContent={`+${row.comments.length - 1}`}
                                            size={"md"}
                                            badgeInset={"0 5px"}
                                        >
                                            <div></div>
                                        </Badge>
                                        : null
                                    }
                                </Alert>
                                : null
                            }
                        </Box>
                    </React.Fragment>
                )
                })
            )}
        />
    )
};
