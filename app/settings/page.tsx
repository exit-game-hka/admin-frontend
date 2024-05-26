import React from 'react';
import {PageWrapperComponent} from "@/components/shared/PageWrapperComponent";
import {SettingOptionsComponent} from "@/components/SettingOptionsComponent";

const SettingsPage: React.FC = () => {
    return (
        <PageWrapperComponent title={"Einstellungen"}>
            <SettingOptionsComponent />
        </PageWrapperComponent>
    );
};

export default SettingsPage;
