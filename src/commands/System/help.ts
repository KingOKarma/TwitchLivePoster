import { Client, Message, MessageEmbed } from "discord.js"
import { ApiClient } from "twitch/lib";
import { commandList, CONFIG, paginate, STORAGE } from "../../utils/globals";
import Storage, { Channel } from "../../utils/storage";

exports.run = async (
    bot: Client,
    msg: Message, 
    args: string[],
    apiClient: ApiClient): Promise<Message | Message[] | undefined> => {
        if (msg.guild === null) return;
        let icon = msg.guild.iconURL({dynamic: true});
        if (icon === null) icon = "https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png" 

        const embed = new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`${msg.guild.name}'s Commands`)
        .setDescription(commandList.map((command) => `**${command.name}** - Aliases: \`${command.aliases.join(", ")}\` \n`
        + `**Description -** ${command.desc}\n`))
        .setColor("0x6441a5")
        .setThumbnail(icon)
        .setFooter(`Prefix: ${CONFIG.prefix}`)
        return msg.channel.send(embed);

    }