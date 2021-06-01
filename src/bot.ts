import { Client, MessageEmbed, TextChannel } from "discord.js";
import { commandList, CONFIG, STORAGE } from "./utils/globals";
import { StaticAuthProvider } from "twitch-auth";
import { ApiClient } from "twitch";
import { CronJob } from "cron";
import Storage from "./utils/storage";

const bot = new Client();

const { accessToken } = CONFIG;
const { discordBotToken } = CONFIG;
const { clientID } = CONFIG;
const { prefix } = CONFIG;
const authProvider = new StaticAuthProvider(clientID, accessToken);

const apiClient = new ApiClient({ authProvider });

bot.on("ready", () => {
    console.log(`${bot.user?.tag} is now online!`);
    const sendChannel = bot.channels.cache.get(STORAGE.liveAnnouceChannelID) as TextChannel;

    //Check if user is live every 2 mins
    const liveCheck = new CronJob("0 */2 * * * *", async () => {
        STORAGE.channels.forEach(async (channel) => {
            const user = await apiClient.helix.streams.getStreamByUserName(channel);
            if (user === null)  {
               channel.annoucedLive = false;
               Storage.saveConfig();
                return;
            }
            if (channel.annoucedLive === true) return;

            let response = STORAGE.liveMessage;

            if (response.includes("{user}")) {
                const replace = new RegExp("{user}", "g");
                response = response.replace(replace, user.userDisplayName);
            }

            if (response.includes("{link}")) {
                const replace = new RegExp("{link}", "g");
                response = response.replace(replace, `https://twitch.tv/${channel.name}`);
            }
            const twitchUser = await user.getUser();
            if (twitchUser === null) return;
 
            const embed = new MessageEmbed()
            .setAuthor(user.userDisplayName, twitchUser.profilePictureUrl)
            .setTitle(`${user.userDisplayName} has just gone live!`)
            .setDescription(response)
            .setColor("0x6441a5")
            .setImage(twitchUser.profilePictureUrl);
            sendChannel.send(embed).then(() => {
                channel.annoucedLive = true;
                Storage.saveConfig();
            })


        })
    })
    liveCheck.start();

})

bot.on("message", (msg) => {
    if (msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);

    const cmd = args.shift()?.toLowerCase();

    if (cmd === undefined) {
        return;
    }

    const cmdIndex = commandList.findIndex((n) => {

        return n.name === cmd || n.aliases.includes(cmd);

    });

    if (cmdIndex === -1) {
        return;
    }

    const foundcmd = commandList[cmdIndex];

    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const commandFile = require(`./commands/${foundcmd.group}/${foundcmd.name}.js`);
        commandFile.run(bot, msg, args, apiClient);

    } catch (err) {

    }

});

bot.login(discordBotToken).catch(console.error);
