import {useContext} from "react";
import {ApplicationContext} from "@/contexts/ApplicationContext";

const useApplicationContext = () => {
    return useContext(ApplicationContext);
}

export default useApplicationContext;