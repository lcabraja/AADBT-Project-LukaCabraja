import PocketBase from "pocketbase";

export const pbFactory = (): PocketBase => {
    return new PocketBase("https://aadbt.lcabraja.dev");
};
