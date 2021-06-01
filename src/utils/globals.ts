import Config from "./config";
import Storage, { Channel } from "./storage";


export const CONFIG = Config.getConfig();

export const STORAGE = Storage.getConfig();

export const commandList = [
    
    // Help CMDs
    { aliases: ["command", "commands"], desc: "This command!", group: "System", name: "help" },
        
    // System CMDs
    { aliases: ["twitch"], desc: "Used to add, remove or list Twitch channels from the live watch", group: "Twitch", name: "channel" },

];

/**
 * Used to create pages from a shop entity
 * @param {Array} array The array to page
 * @param {number} pageSize How big are each of the pages?
 * @param {number} pageNumber Which Page number do you wish to be on?
 * @returns {Array} an array
 */
 export function paginate(array: any[], pageSize: number, pageNumber: number): any[] {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

