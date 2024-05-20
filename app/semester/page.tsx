import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {SemesterListComponent} from "@/components/SemesterListComponent";
import Link from "next/link";
import {Button} from "@mui/joy";

const SemesterPage: React.FC = () => {
    const rightContent = (
        <Link href={"/semester/add"}>
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

