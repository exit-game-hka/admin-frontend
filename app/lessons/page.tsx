import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import Link from "next/link";
import {Button} from "@mui/joy";
import {VeranstaltungListComponent} from "@/components/VeranstaltungListComponent";

const EventPage: React.FC = () => {
    const rightContent = (
        <Link href={"/lessons/add"}>
            <Button>Neue Veranstaltung</Button>
        </Link>
    );

    return (
        <PageWrapperComponent title={"Veranstaltungen"} rightContent={rightContent}>
            <VeranstaltungListComponent />
        </PageWrapperComponent>
    );
};

export default EventPage;

