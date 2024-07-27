import {Raum} from "@/api/raum";

export const resolveThumbnail = (room: Raum): string => {
    switch (room.name) {
        case "Raum 1": return "room1.png";
        case "Raum 2": return "room2.png";
        case "Raum 3": return "room3.png";
        case "Raum 4": return "room4.png";
        case "Raum 5": return "room5.png";
        case "Raum 6": return "room6.png";
        default: return "forest.jpg";
    }
};
