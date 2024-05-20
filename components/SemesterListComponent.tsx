"use client";
import React from 'react';
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Semester} from "@/api/semester";
import {Alert, Box} from "@mui/joy";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import {CustomTableComponent} from "@/components/shared/CustomTableComponent";
import {useMediaQuery} from "@/hooks/useMediaQuery";

export const SemesterListComponent: React.FC = () => {
    const { isSmall } = useMediaQuery();
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
                <>
                    <Box component="td" sx={{ width: "50px" }}></Box>
                    <Box component="td">Bezeichnung</Box>
                    {isSmall ?
                        null :
                        <>
                            <Box component="td">Start</Box>
                            <Box component="td">Ende</Box>
                        </>
                    }
                </>
            }
            bodyRows={semesters.map((s) =>
                <>
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
                </>
            )}
        />
    );
};

