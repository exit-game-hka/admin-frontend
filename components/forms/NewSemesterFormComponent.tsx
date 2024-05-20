"use client";
import React, {ChangeEvent, useState} from 'react';
import {useRouter} from "next/navigation";
import useApplicationContext from "@/hooks/useApplicationContext";
import {FormContainerComponent} from "@/components/forms/FormContainerComponent";
import FormLabel from "@mui/joy/FormLabel";
import {Alert, Button, Input} from "@mui/joy";
import FormHelperText from "@mui/joy/FormHelperText";
import FormControl from "@mui/joy/FormControl";
import {SemesterDto} from "@/api/semester";

type SemesterString = {
    start: string,
    ende: string,
    bezeichnung: string,
}
const INITIAL_STATE: SemesterString = {
    start: "",
    ende: "",
    bezeichnung: "",
};
export const NewSemesterFormComponent: React.FC = () => {
    const router = useRouter();
    const { createSemester } = useApplicationContext();
    const [semesterToSubmit, setSemesterToSubmit] = useState<SemesterString>(INITIAL_STATE);
    const [formError, setFormError] = useState<string | undefined>(undefined);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        event?.stopPropagation();

        setSemesterToSubmit(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (!semesterToSubmit.start) {
            setFormError("Geben Sie erst ein Startdatum ein.");
            return;
        }
        if (!semesterToSubmit.ende) {
            setFormError("Geben Sie ein Enddatum ein.");
            return;
        }
        if (!semesterToSubmit.bezeichnung) {
            setFormError("Geben Sie eine Bezeichnung ein.");
            return;
        }
        const payload = {
            ...semesterToSubmit,
            start: new Date(semesterToSubmit.start),
            ende: new Date(semesterToSubmit.ende),
        };
        await createSemester(payload as SemesterDto);
        router.push("/semester");
    };

    return (
        <FormContainerComponent>
            <FormControl size="lg">
                <FormLabel>Start</FormLabel>
                <Input
                    slotProps={{
                        input: {
                            component: "input",
                            name: "start",
                            type: "date",
                            value: semesterToSubmit.start,
                            placeholder: "Startdatum eingeben",
                            onChange: handleChange,
                        }
                    }}
                />
            </FormControl>

            <FormControl size="lg">
                <FormLabel>Ende</FormLabel>
                <Input
                    slotProps={{
                        input: {
                            component: "input",
                            name: "ende",
                            type: "date",
                            value: semesterToSubmit.ende,
                            placeholder: "Enddatum eingeben",
                            onChange: handleChange,
                        }
                    }}
                />
            </FormControl>

            <FormControl size="lg">
                <FormLabel>Bezeichnung</FormLabel>
                <Input
                    slotProps={{
                        input: {
                            component: "input",
                            name: "bezeichnung",
                            type: "text",
                            value: semesterToSubmit.bezeichnung,
                            placeholder: "Bezeichnung eingeben",
                            onChange: handleChange,
                        }
                    }}
                />
                <FormHelperText>
                    z.B: SS{new Date().toLocaleDateString([], { year: "2-digit" })} oder
                    WS{new Date().toLocaleDateString([], { year: "2-digit" })}/{Number(new Date().toLocaleDateString([], { year: "2-digit" })) + 1}
                </FormHelperText>
            </FormControl>
            {formError ? <Alert color="danger">{formError}</Alert> : null}
            <Button onClick={handleSubmit}>Speichern</Button>
        </FormContainerComponent>
    );
};

