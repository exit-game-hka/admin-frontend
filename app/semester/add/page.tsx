import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewSemesterFormComponent} from "@/components/forms/NewSemesterFormComponent";
import {protectRoute} from "@/utils/protectRoute";
import {getServerSession} from "next-auth";
import {ADMIN_ROLE} from "@/hooks/useAuth";
import {redirect} from "next/navigation";

const NewSemesterPage: React.FC = async () => {
    await protectRoute();
    const session = await getServerSession();

    // @ts-ignore
    if (!session?.roles?.includes(ADMIN_ROLE)) {
        redirect("/semester");
        return;
    }

    return (
        <PageWrapperComponent title={"Neues Semester"}>
            <NewSemesterFormComponent />
        </PageWrapperComponent>
    );
};

export default NewSemesterPage;

