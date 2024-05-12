const { Client, GatewayIntentBits, Presence, ActivityType, EmbedBuilder, userMention } = require("discord.js");
const { getImageUrlFull} = require("imagen-core");
const { getRandomAnimeImageUrl } = require('./modules/anime');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});
const config = require("./config/config.json");

client.once("ready", () => {
    console.log(`Sstudios bot © SstudiosDev - Connected as ${client.user.tag}`);

    const formattedTime = config.showTimestamp ? new Date().toLocaleTimeString() : "";

    const onlineMessageChannel = client.channels.cache.get(config.onlineMessageChannelId);
    if (onlineMessageChannel) {
        onlineMessageChannel.send(`${config.onlineMessage} ${formattedTime}`);
    } else {
        console.error(`Could not find the online message channel with ID: ${config.onlineMessageChannelId}`);
    }

    function updatePresence(){
        const activities = [
            {name:'Mostly sleepless🌛', type:ActivityType.Playing},
            {name:'s!spigot', type:ActivityType.Watching},
        ];

        const activity = activities[Math.floor(Math.random()* activities.length)];

        client.user.setActivity(activity.name, {type:activity.type});
    }

    setInterval(updatePresence, 10000)

    const channel = client.channels.cache.get("");

    if (!channel) {
        console.error("Could not find the channel.");
        return;
    }

    setInterval(async () => {
        try {
            const animeImageUrl = await getRandomAnimeImageUrl();
            const embed = new EmbedBuilder()
                .setTitle("Random Anime Image")
                .setColor(Math.floor(Math.random() * 16777215))
                .setImage(animeImageUrl);

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Failed to send anime image:", error.message);
        }
    }, 600000);

});

client.on("guildMemberAdd", async (member) => {
    // ID of the channel where the welcome message will be sent
    const welcomeChannelId = ""; // Replace with the ID of your welcome channel
    member.send(`Welcome to ${member.guild.name}! We hope you enjoy your stay on our server.`);

    // Find the channel by its ID
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    // Check if the channel was found
    if (welcomeChannel) {
        // Send a welcome message
        welcomeChannel.send(`Welcome to the server, ${member.user}! We hope you enjoy your stay.`);

        // ID of the role to be assigned to the new member
        const roleId = ""; // Replace with the ID of the role you want to assign

        // Find the role by its ID
        const role = member.guild.roles.cache.get(roleId);

        // Check if the role was found
        if (role) {
            // Assign the role to the new member
            await member.roles.add(role);
            console.log(`Assigned the role ${role.name} to ${member.user.tag}`);
        } else {
            console.error(`Could not find the role with ID: ${roleId}`);
        }
    } else {
        console.error(`Could not find the welcome channel with ID: ${welcomeChannelId}`);
    }
});


client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "spigot") {
        // Crear un mensaje embed
        const embed = new EmbedBuilder()
            .setTitle("Spigot")
            .setDescription(`Hello ${userMention(message.author.id)}, thank you for using this command. If you'd like to support us with our plugins, please visit this link and leave a positive review. Your feedback is invaluable to us! Thanks for your support! \n\n[SPIGOT LINK](https://www.spigotmc.org/members/sstudios-team.1957112/)\n`)
            .setThumbnail('https://avatars.githubusercontent.com/u/4350249?s=200&v=4')
            .setTimestamp()
            .setFooter('Sstudios bot © SstudiosDev')
            .setColor("#78dea6");

        // Enviar el mensaje con el botón
        message.channel.send({
            embeds: [embed],
        });
    } else if (command === "clear") {
        // Verificar si el autor del mensaje tiene permisos para borrar mensajes
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply("you don't have permission to use this command.");
        }

        // Verificar que se proporcionó un número de mensajes a borrar
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount < 1 || amount > 99) {
            return message.reply("please provide a number between 1 and 99 to clear messages.");
        }

        // Borrar los mensajes
        message.channel.bulkDelete(amount + 1)
            .then(messages => {
                message.channel.send(`Deleted ${messages.size} messages.`);
            })
            .catch(error => {
                console.error("Error deleting messages:", error);
                message.channel.send("An error occurred while deleting messages.");
            });
    } else if (command === "image") {
        try {
            const { imageUrlFull } = await getImageUrlFull();
            const initialMessage = await message.channel.send('Obtaining a random image...');

            setTimeout(async () => {
                const embed = new EmbedBuilder()
                    .setTitle('Random Image')
                    .setDescription(`[Enlace](${imageUrlFull})`)
                    .setColor(Math.floor(Math.random() * 16777215))
                    .setImage(imageUrlFull);

                await initialMessage.edit({ content: 'Here is your random image:', embeds: [embed] });
            }, 3000);

        } catch (error) {
            console.error('Error when obtaining the random image:', error.message);
            message.channel.send('Error when obtaining the random image.');
        }
    } else if (command === "anime") {
        try {
            const animeImageUrl = await getRandomAnimeImageUrl();
            const initialMessage = await message.channel.send('Getting a random anime image...');
            
            setTimeout(async () => {
              const embed = new EmbedBuilder()
                .setTitle('Random Anime Image')
                .setDescription(`[Link](${animeImageUrl})`)
                .setColor(Math.floor(Math.random() * 16777215)) // Color aleatorio
                .setImage(animeImageUrl);
              
              await initialMessage.edit({ content: 'Here is your random anime image:', embeds: [embed] });
            }, 3000);
      
          } catch (error) {
            console.error('Failed to get anime image:', error.message);
            message.channel.send('Failed to get anime image.');
          }
    }
});

client.login(config.token);
