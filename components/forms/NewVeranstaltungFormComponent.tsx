"use client";
import React, {ChangeEvent, useState} from 'react';
import {VeranstaltungDto} from "@/api/veranstaltung";
import {useRouter} from "next/navigation";
import useApplicationContext from "@/hooks/useApplicationContext";
import {FormContainerComponent} from "@/components/forms/FormContainerComponent";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {Alert, Button, Input} from "@mui/joy";
import FormHelperText from "@mui/joy/FormHelperText";

const INITIAL_STATE: VeranstaltungDto = {
    name: "",
    bezeichnung: "",
    beschreibung: "",
};
export const NewVeranstaltungFormComponent: React.FC = () => {
    const router = useRouter();
    const { createVeranstaltung } = useApplicationContext();
    const [veranstaltungToSubmit, setVeranstaltungToSubmit] = useState<VeranstaltungDto>(INITIAL_STATE);
    const [formError, setFormError] = useState<string | undefined>(undefined);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        event?.stopPropagation();

        setVeranstaltungToSubmit(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async () => {
        if (!veranstaltungToSubmit.name) {
            setFormError("Geben Sie erst einen Namen ein.");
            return;
        }
        if (!veranstaltungToSubmit.bezeichnung) {
            setFormError("Geben Sie eine Bezeichnung ein.");
            return;
        }
        await createVeranstaltung(veranstaltungToSubmit);
        router.push("/lessons");
    };

    return (
        <FormContainerComponent>
            <FormControl size="lg">
                <FormLabel>Name</FormLabel>
                <Input
                    slotProps={{
                        input: {
                            component: "input",
                            name: "name",
                            type: "text",
                            value: veranstaltungToSubmit.name,
                            placeholder: "Name eingeben",
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
                            value: veranstaltungToSubmit.bezeichnung,
                            placeholder: "Bezeichnung eingeben",
                            onChange: handleChange,
                        }
                    }}
                />
                <FormHelperText>Eine Abkürzung reicht. z.B: SWE für Software Engineering</FormHelperText>
            </FormControl>

            <FormControl size="lg">
                <FormLabel>Beschreibung</FormLabel>
                <Input
                    slotProps={{
                        input: {
                            component: "textarea",
                            name: "beschreibung",
                            type: "text",
                            value: veranstaltungToSubmit.beschreibung,
                            placeholder: "Beschreibung eingeben",
                            height: "auto-fit",
                            onChange: handleChange,
                        }
                    }}
                />
                <FormHelperText>Worum es geht. Dieses Feld ist optional</FormHelperText>
            </FormControl>
            {formError ? <Alert color="danger">{formError}</Alert> : null}
            <Button onClick={handleSubmit}>Speichern</Button>
        </FormContainerComponent>
    );
};

