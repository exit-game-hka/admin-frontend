import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import Link from "next/link";
import {Button} from "@mui/joy";
import {VeranstaltungListComponent} from "@/components/VeranstaltungListComponent";
import {protectRoute} from "@/utils/protectRoute";

const LessonsPage: React.FC = async () => {
    await protectRoute();

    const rightContent = (
        <Link href={"/lessons/add"} style={{ display: "grid" }}>
            <Button>Neues Fachgebiet</Button>
        </Link>
    );

    return (
        <PageWrapperComponent title={"Fachgebiete"} rightContent={rightContent}>
            <VeranstaltungListComponent />
        </PageWrapperComponent>
    );
};

export default LessonsPage;

