import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {NewPlayerFormComponent} from "@/components/forms/NewPlayerFormComponent";
import {protectRoute} from "@/utils/protectRoute";
import {getServerSession} from "next-auth";
import {ADMIN_ROLE} from "@/hooks/useAuth";
import {redirect} from "next/navigation";

const NewPlayerPage: React.FC = async () => {
    await protectRoute();
    const session = await getServerSession();

    // @ts-ignore
    if (!session?.roles?.includes(ADMIN_ROLE)) {
        redirect("/players");
        return;
    }
    return (
        <PageWrapperComponent title={"Neuer Spieler"}>
            <NewPlayerFormComponent />
        </PageWrapperComponent>
    );
};

export default NewPlayerPage;
