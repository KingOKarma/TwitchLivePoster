import { Client } from "discord.js";
import { CONFIG } from "./utils/globals";
const bot = new Client();


bot.on("ready", () => {
    console.log(`${bot.user?.tag} is now online!`);
})

bot.login(CONFIG.discordBotToken).catch(console.error);
