"use client";
import React, {ChangeEvent, useState} from 'react';
import {Alert, Button, Input} from "@mui/joy";
import useApplicationContext from "@/hooks/useApplicationContext";
import {SpielerDto} from "@/api/spieler";
import {useRouter} from "next/navigation";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Autocomplete from '@mui/joy/Autocomplete';
import {Semester} from "@/api/semester";
import useSWR from "swr";
import {Veranstaltung} from "@/api/veranstaltung";
import {FormContainerComponent} from "@/components/forms/FormContainerComponent";
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';

const INITIAL_STATE: Partial<SpielerDto> = {
    avatarName: "",
    semesterId: undefined,
    veranstaltungId: undefined,
} as const;

export const NewPlayerFormComponent: React.FC = () => {
    const router = useRouter();
    const { createSpieler, getAllSemester, getAllVeranstaltungen } = useApplicationContext();
    const [spielerDto, setSpielerDto] = useState<SpielerDto>(INITIAL_STATE as SpielerDto);

    const [formError, setFormError] = useState<string | undefined>(undefined);

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

    const handleSubmit = async () => {
        if (!spielerDto.avatarName) {
            setFormError("Generieren Sie erst eine Spieler-ID.");
            return;
        }
        if (!spielerDto.semesterId) {
            setFormError("Wählen Sie ein Semester aus. Ein Spieler muss mit einem Semester und einer Veranstaltung verbunden sein.");
            return;
        }
        if (!spielerDto.veranstaltungId) {
            setFormError("Wählen Sie eine Veranstaltung aus. Ein Spieler muss mit einem Semester und einer Veranstaltung verbunden sein.");
            return;
        }
        await createSpieler(spielerDto);
        router.push("/players");
    };

    const generatePlayerId = () => {
        setSpielerDto(prevState => ({
            ...prevState,
            avatarName: `#${new Date().getTime().toString()}`,
        }));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        event?.stopPropagation();
        setSpielerDto(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    }

    const handleSemesterChange = (option: Semester) => {
        setSpielerDto(prevState => ({
            ...prevState,
            semesterId: option ? (option as Semester).id : "",
        }));
    }

    const handleVeranstaltungChange = (option: Veranstaltung) => {
        setSpielerDto(prevState => ({
            ...prevState,
            veranstaltungId: option ? (option as Veranstaltung).id : "",
        }));
    }

    if (
        isLoadingSemesters ||
        isLoadingVeranstaltungen ||
        !semesters ||
        !veranstaltungen
    ) return <div>Formular wird geladen...</div>

    if (errorSemesters) return <Alert color="danger">
        Semester konnten nicht geladen werden: {(errorSemesters as Error).toString()}
    </Alert>

    if (errorVeranstaltungen) return <Alert  color="danger">
        Veranstaltungen konnten nicht geladen werden: {(errorVeranstaltungen as Error).toString()}
    </Alert>

    return (
        <FormContainerComponent>
            <FormControl size="lg">
                <FormLabel>Spieler-ID</FormLabel>
                <Input
                    readOnly
                    slotProps={{
                        input: {
                            component: "input",
                            name: "avatarName",
                            value: spielerDto.avatarName,
                            placeholder: "Spieler-ID generieren",
                            onChange: handleChange,
                        }
                    }}
                    startDecorator={<VpnKeyOutlinedIcon fontSize="small" />}
                    endDecorator={<Button onClick={generatePlayerId}>Generieren</Button>}
                />
                <FormHelperText>
                    Eine Spieler-ID ist ein Zufallscode, der einen Spieler des Exit-Games eindeutig, aber anonym identifiziert!
                </FormHelperText>
            </FormControl>
            <FormControl size="lg">
                <FormLabel>Semester</FormLabel>
                <Autocomplete
                    placeholder="Semester auswählen"
                    options={semesters}
                    getOptionLabel={(option) => option.bezeichnung}
                    onChange={(_, option) => handleSemesterChange(option as Semester)}
                />
            </FormControl>
            <FormControl size="lg">
                <FormLabel>Veranstaltung</FormLabel>
                <Autocomplete
                    placeholder="Veranstaltung auswählen"
                    options={veranstaltungen}
                    getOptionLabel={(option) => `${option.bezeichnung} - ${option.name}`}
                    onChange={(_, option) => handleVeranstaltungChange(option as Veranstaltung)}
                />
            </FormControl>
            {formError ? <Alert color="danger">{formError}</Alert> : null}
            <Button onClick={handleSubmit}>Speichern</Button>
        </FormContainerComponent>
    );
};
