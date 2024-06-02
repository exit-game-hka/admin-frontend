import React from "react";
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {SemesterSelectionComponent} from "@/components/shared/SemesterSelectionComponent";
import {StatusListComponent} from "@/components/shared/StatusListComponent";
import {Stack} from "@mui/joy";
import {protectRoute} from "@/utils/protectRoute";

const Home: React.FC = async () => {
    await protectRoute();
    return (
        <PageWrapperComponent title={"Startseite"} rightContent={<SemesterSelectionComponent />}>
            <Stack spacing={"var(--gap-3)"}>
                <StatusListComponent />
            </Stack>
        </PageWrapperComponent>
    );
}

export default Home;