"use client";
import React from 'react';
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {Semester} from "@/api/semester";
import useApplicationContext from "@/hooks/useApplicationContext";
import useSWR from "swr";
import {Alert, Chip, Option, Select} from "@mui/joy";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import {useMediaQuery} from "@/hooks/useMediaQuery";

export const SemesterSelectionComponent: React.FC = () => {
    const { getAllSemester, semester, setSemester } = useApplicationContext();
    const { isSmall } = useMediaQuery();

    const {
        data: semesters,
        isLoading: isLoadingSemesters,
        error: errorSemesters,
    } = useSWR<Semester[]>("getAllSemester", async () => await getAllSemester());

    const handleSemesterChange = (event: any) => {
        const semesterBezeichnung = event.target.innerText;
        const selectedSemester = semesters?.find((s) => s.bezeichnung === semesterBezeichnung);
        if (!selectedSemester) {
            console.error("Semester not found in options.");
            return;
        }
        setSemester(selectedSemester);
    }

    if (isLoadingSemesters || !semesters) return <div>Das Semester wird geladen...</div>

    if (errorSemesters) return <Alert color="danger">
        Semester konnten nicht geladen werden: {(errorSemesters as Error).toString()}
    </Alert>

    return (
        <FormControl size="md">
            <FormLabel>Semester</FormLabel>
            <Select
                defaultValue={semester ? semester.id : undefined}
                placeholder="Semester auswählen"
                startDecorator={<SchoolOutlinedIcon />}
                endDecorator={<Chip size="sm" variant="solid" color="primary">{semesters.length}</Chip>}
                sx={{ width: isSmall ? "100%" : 300 }}
                onChange={handleSemesterChange}
            >
                {semesters.map((s) =>
                    <Option key={s.id} value={s.id}>{s.bezeichnung}</Option>
                )}
            </Select>
        </FormControl>
    );
};
