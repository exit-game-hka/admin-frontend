"use client";
import React from 'react';
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Semester} from "@/api/semester";
import {Alert, Box} from "@mui/joy";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {useAuth} from "@/hooks/useAuth";

export const SemesterListComponent: React.FC = () => {
    const { isSmall } = useMediaQuery();
    const { data: session } = useAuth();
    const { getAllSemester } = useApplicationContext();
    const {
        data: semesters,
        isLoading,
        error,
    } = useSWR<Semester[]>("getAllSemester", async () => await getAllSemester());

    if (isLoading || !semesters) return <div>Wird geladen...</div>

    if (error) return <Alert color="danger">{(error as Error).message}</Alert>

    return (
        <CustomTableComponent
            headerCells={
                <Box component="tr">
                    <Box component="th" sx={{ width: "50px" }}></Box>
                    <Box component="th">Bezeichnung</Box>
                    {isSmall ?
                        null :
                        <>
                            <Box component="th">Start</Box>
                            <Box component="th">Ende</Box>
                        </>
                    }
                </Box>
            }
            bodyRows={semesters.map((s, index) => ({
                    content: (
                        <React.Fragment key={index}>
                            <Box component="td" sx={{ width: "50px" }}>
                                <SchoolOutlinedIcon />
                            </Box>
                            <Box component="td">{s.bezeichnung}</Box>
                            {isSmall ?
                                null :
                                <>
                                    <Box component="td">{s.start.toLocaleDateString([], {day: "2-digit", month: "2-digit", year: "numeric"})}</Box>
                                    <Box component="td">{s.ende.toLocaleDateString([], {day: "2-digit", month: "2-digit", year: "numeric"})}</Box>
                                </>
                            }
                        </React.Fragment>
                    )
                })
            )}
        />
    );
};

