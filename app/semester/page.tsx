import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {SemesterListComponent} from "@/components/SemesterListComponent";
import Link from "next/link";
import {Button} from "@mui/joy";
import {protectRoute} from "@/utils/protectRoute";
import {getServerSession} from "next-auth";
import {ADMIN_ROLE} from "@/hooks/useAuth";

const SemesterPage: React.FC = async () => {
    await protectRoute();
    const session = await getServerSession();

    // @ts-ignore
    const rightContent = session?.roles?.includes(ADMIN_ROLE) ? (
        <Link href={"/semester/add"} style={{ display: "grid" }}>
            <Button>Neues Semester</Button>
        </Link>
    ) : null;

    return (
        <PageWrapperComponent title={"Semester"} rightContent={rightContent}>
            <SemesterListComponent />
        </PageWrapperComponent>
    );
};

export default SemesterPage;

