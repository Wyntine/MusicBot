// @ts-check

const { readdirSync } = require("fs");
const { token } = require("./src/config");
const { commands, db } = require("./src/components/files");
const { distube, client } = require("./src/components/client");

process.on("unhandledRejection", console.error).on("uncaughtException", console.error);

distube.on("finish", async () => {
  const guildMap = client.guilds.cache.map((guild) => guild);

  for (const guild of guildMap) {
    const data = db.fetch(`music_${guild.id}`);

    if (!data) continue;

    const { mesaj, kanal } = data;
    const channel = guild.channels.cache.get(kanal);

    if (channel?.isTextBased()) {
      try {
        const message = await channel.messages.fetch(mesaj);

        if (!message) continue;

        message.edit({ content: "🎵 | Music ended.", embeds: [], components: [] });
      } catch (error) {}
    }
  }
});

readdirSync("./src/commands").forEach(async (file) => {
  const command = require(`./src/commands/${file}`);
  commands.push(command);
});

readdirSync("./src/events").forEach(async (file) => {
  const event = require(`./src/events/${file}`);
  const runner = (...args) => event.execute(...args);

  if (event.once) {
    client.once(event.name, runner);
  } else {
    client.on(event.name, runner);
  }
});

client.login(token);
