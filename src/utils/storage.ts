import { dump, load } from "js-yaml";
import { STORAGE } from "./globals";
import fs from "fs";

export interface Channel {
    name: string;
    annoucedLive: boolean;
}

/**
 * This represents the storage.yml
 * @class Storage
 * @property {Channel[]} channels
 * @property {string} liveAnnouceChannelID
 * @property {string} liveMessage


 */
export default class Storage {
    private static readonly _configLocation = "./storage.yml";

    public channels: Channel[];

    public liveAnnouceChannelID: string;

    public liveMessage: string;

    private constructor() {
        this.channels = [{ name: "", annoucedLive: false }];
        this.liveAnnouceChannelID = "";
        this.liveMessage = "";

    }

    /**
       *  Call getConfig instead of constructor
       */
    public static getConfig(): Storage {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!fs.existsSync(Storage._configLocation)) {
            throw new Error("Please create a storage.yml");
        }
        const fileContents = fs.readFileSync(
            Storage._configLocation,
            "utf-8"
        );
        const casted = load(fileContents) as Storage;

        return casted;
    }

    /**
   *  Safe the config to the storage.yml default location
   */
    public static saveConfig(): void {
        fs.writeFileSync(Storage._configLocation, dump(STORAGE));
    }
}