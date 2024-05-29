import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import PlayerListComponent from "@/components/PlayerListComponent";
import {Button} from "@mui/joy";
import Link from "next/link";

const PlayersPage: React.FC = async () => {
    const addNewPlayerButton = (
        <Link href={"/players/add"} style={{ display: "grid" }}>
            <Button>Neuer Spieler</Button>
        </Link>
    );

    return (
        <PageWrapperComponent title={"Spieler"} rightContent={addNewPlayerButton}>
            <PlayerListComponent />
        </PageWrapperComponent>
    );
};

export default PlayersPage;

