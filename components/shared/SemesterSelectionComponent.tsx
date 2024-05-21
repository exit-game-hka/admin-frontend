"use client";
import React from 'react';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Autocomplete from "@mui/joy/Autocomplete";
import {Semester} from "@/api/semester";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Alert} from "@mui/joy";

export const SemesterSelectionComponent: React.FC = () => {
    const { getAllSemester, semester, setSemester } = useApplicationContext();

    const {
        data: semesters,
        isLoading: isLoadingSemesters,
        error: errorSemesters,
    } = useSWR<Semester[]>("getAllSemester", async () => await getAllSemester());

    if (isLoadingSemesters || !semesters) return <div>Formular wird geladen...</div>

    if (errorSemesters) return <Alert color="danger">
        Semester konnten nicht geladen werden: {(errorSemesters as Error).toString()}
    </Alert>

    return (
        <FormControl size="md">
            <FormLabel>Semester</FormLabel>
            <Autocomplete
                placeholder="Semester auswählen"
                options={semesters}
                value={semester!}
                getOptionLabel={(option) => option.bezeichnung}
                onChange={(_, option) => setSemester(option as Semester)}
            />
        </FormControl>
    );
};
