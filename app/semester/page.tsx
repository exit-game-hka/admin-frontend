import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {SemesterListComponent} from "@/components/SemesterListComponent";
import Link from "next/link";
import {Button} from "@mui/joy";
import {protectRoute} from "@/utils/protectRoute";

const SemesterPage: React.FC = async () => {
    await protectRoute();

    const rightContent = (
        <Link href={"/semester/add"} style={{ display: "grid" }}>
            <Button>Neues Semester</Button>
        </Link>
    );

    return (
        <PageWrapperComponent title={"Semester"} rightContent={rightContent}>
            <SemesterListComponent />
        </PageWrapperComponent>
    );
};

export default SemesterPage;

