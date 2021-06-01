import Config from "./config";
import Storage, { Channel } from "./storage";


export const CONFIG = Config.getConfig();

export const STORAGE = Storage.getConfig();

export const commandList = [
    // System CMDs
    { aliases: ["twitch"], group: "Twitch", name: "channel" },

    // Help CMDs
    { aliases: ["command", "commands"], group: "System", name: "help" },


];

/**
 * Used to create pages from a shop entity
 * @param {Array} array The array to page
 * @param {number} pageSize How big are each of the pages?
 * @param {number} pageNumber Which Page number do you wish to be on?
 * @returns {Array} an array
 */
 export function paginate(array: string[], pageSize: number, pageNumber: number): string[] {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

