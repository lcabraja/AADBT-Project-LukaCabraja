import PocketBase from "pocketbase";

export const newPb = (): PocketBase => {
    return new PocketBase("https://aadbt.lcabraja.dev");
};
