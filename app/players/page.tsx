import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import PlayerListComponent from "@/components/PlayerListComponent";
import {Button} from "@mui/joy";
import Link from "next/link";
import {protectRoute} from "@/utils/protectRoute";
import {getServerSession} from "next-auth";
import {ADMIN_ROLE} from "@/hooks/useAuth";

const PlayersPage: React.FC = async () => {
    await protectRoute();
    const session = await getServerSession();

    // @ts-ignore
    const addNewPlayerButton = session?.roles?.includes(ADMIN_ROLE) ? (
        <Link href={"/players/add"} style={{ display: "grid" }}>
            <Button>Neuer Spieler</Button>
        </Link>
    ) : null;

    return (
        <PageWrapperComponent title={"Spieler"} rightContent={addNewPlayerButton}>
            <PlayerListComponent />
        </PageWrapperComponent>
    );
};

export default PlayersPage;

