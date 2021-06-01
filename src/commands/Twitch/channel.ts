import { Client, Message, MessageEmbed } from "discord.js"
import { ApiClient } from "twitch/lib";
import { CONFIG, paginate, STORAGE } from "../../utils/globals";
import Storage, { Channel } from "../../utils/storage";

exports.run = async (
    bot: Client,
    msg: Message, 
    args: string[],
    apiClient: ApiClient): Promise<Message | Message[] | undefined> => {

        if (!msg.member?.hasPermission("MANAGE_GUILD")) return msg.channel.send(
            `${msg.author} You do not have permission to run this command, you need the "Manage Server`
            + " permission to use this"
        );

        if (args[0] === undefined) return msg.channel.send(
            `${msg.author} Please either specify \"add\", \"remove\" or \"list\" to do so with the twitch streamers`
        );

    switch (args[0].toLowerCase()) {
        case "add":
            if (args[1] === undefined) return msg.channel.send(
                `${msg.author} Please specify a twitch channel name to add to the streamers list`
            )
            const input = args[1].toLowerCase();

            const user = await apiClient.helix.users.getUserByName(input);
            if (user === null) return msg.channel.send(
                `${msg.author} That User does not exist, did you spell it correctly?`
            )

            const channel = STORAGE.channels.find((ch) => ch.name === input)
            if (channel !== undefined) return msg.channel.send(
                `${msg.author} That user is already on the list!`
            )
            
            STORAGE.channels.push({name: input, annoucedLive: false });
            Storage.saveConfig();
            return msg.channel.send(
                `${msg.author} I have added \`${input}\` to the list!`
            )

        case "remove":
            if (args[1] === undefined) return msg.channel.send(
                `${msg.author} Please specify a twitch channel name to remove from the streamers list`
            )
            if (!args[1].match('^[0-9]+$')) return msg.channel.send(
                `${msg.author} Please type a number of what channel you wish to remove, you can use \`${CONFIG.prefix}channel list\``
                + " to find their numbers"
            );

            const index = Number(args[1]);

            const findChannel = STORAGE.channels[index - 1];
            if (findChannel === undefined) return msg.channel.send(
                `${msg.author} That user is not on the list!`
            )
            
            STORAGE.channels.splice(index - 1, 1);
            Storage.saveConfig();
            return msg.channel.send(
                `${msg.author} I have removed \`${findChannel.name}\` from the list!`
            )


        case "list":
            let page = 1;
            let number = args[1];
            if (args[1] === undefined) number = "a";
            if (number.match('^[0-9]+$')) page = Number(number);

            const formattedArray: string[] = []
            STORAGE.channels.forEach((usersArray, index) => {
                formattedArray.push(`\`${index + 1}\` - **${usersArray.name}**\n`);
            });

            const channelsPaged: string[] = paginate(formattedArray, 3, page)

            if (channelsPaged.length === 0) {
                return msg.channel.send("There are no channels on that page Or There are no users on the list!");
              }
            const embed = new MessageEmbed()
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL( { dynamic: true} ))
            .setTitle("Streamers Channels List")
            .setDescription(channelsPaged.map((channel) => channel))
            return msg.channel.send(embed);
            
    
        default:
            return msg.channel.send(
                `${msg.author} Please either specify \"add\", \"remove\" or \"list\" to do so with the twitch streamers`
            );
    }


}