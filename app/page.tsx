import React from "react";
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {SemesterSelectionComponent} from "@/components/shared/SemesterSelectionComponent";
import {StatusListComponent} from "@/components/shared/StatusListComponent";
import {Box, Button, Card, Stack, Typography} from "@mui/joy";
//import PlayerListComponent from "@/components/PlayerListComponent";
//import Link from "next/link";

const Home: React.FC = () => {
    return (
        <PageWrapperComponent title={"Startseite"} rightContent={<SemesterSelectionComponent />}>
            <Stack spacing={"var(--gap-3)"}>
                <StatusListComponent />
                <Box
                    component={"div"}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridGap: "var(--gap-3)",
                        alignItems: "start",
                        alignContent: "start",
                        "@media screen and (max-width: 900px)": {
                            gridTemplateColumns: "1fr",
                        },
                    }}
                >
                    {/*<Card>*/}
                    {/*    <Stack direction="row" alignItems="center" alignContent="center">*/}
                    {/*        <Typography level="title-lg" sx={{ flexGrow: 1 }}>Spieler</Typography>*/}
                    {/*        <Link href={"/players"}>*/}
                    {/*            <Button variant="plain">Alle Spieler</Button>*/}
                    {/*        </Link>*/}
                    {/*    </Stack>*/}
                    {/*    <PlayerListComponent*/}
                    {/*        limit={3}*/}
                    {/*        tableProps={{*/}
                    {/*            variant: "plain",*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Card>*/}
                    {/*<div></div>*/}
                </Box>
            </Stack>
        </PageWrapperComponent>
    );
}

export default Home;