// @ts-check

const {
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  ButtonInteraction,
  EmbedBuilder,
} = require("discord.js");
const { distube } = require("./client");
const { db } = require("./files");
const { stopRows, playRows } = require("./static");
const { Queue, Song, RepeatMode } = require("distube");

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ModalSubmitInteraction<"cached">} interaction
 */
async function setVolume(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  const queue = distube.getQueue(guild);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);

  const volume =
    interaction instanceof ModalSubmitInteraction
      ? parseInt(interaction.fields.getTextInputValue("setvolume"))
      : interaction.options.getNumber("number", true);

  if (volume < 1) return interaction.followUp("The number must not be less than 1.");
  if (volume > 100) return interaction.followUp("The number should not be greater than 100.");

  distube.setVolume(guild, volume);
  return interaction.followUp(`Successfully set the volume of the music to **${volume}**`);
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function setSpeed(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);

  const speed = queue.filters.has("nightcore");
  speed ? queue.filters.remove("nightcore") : queue.filters.add("nightcore");
  const speedMessage = speed
    ? "The song was reverted back to the old speed successfully."
    : "The song was sped up successfully.";

  return interaction.followUp(speedMessage);
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function setSlow(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);

  const slow = queue.filters.has("vaporwave");
  slow ? queue.filters.remove("vaporwave") : queue.filters.add("vaporwave");
  const slowMessage = slow
    ? "The song was reverted back to the old speed successfully."
    : "The song was successfully slowed down.";

  return interaction.followUp(slowMessage);
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function setBass(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);

  const bass = queue.filters.has("bassboost");
  bass ? queue.filters.remove("bassboost") : queue.filters.add("bassboost");
  const bassMessage = bass
    ? "The song has been de-boosted successfully."
    : "The song has been boosted successfully.";

  return interaction.followUp(bassMessage);
}

/**
 * @param {Song<unknown>} song
 */
function songEmbed(song) {
  return new EmbedBuilder()
    .addFields(
      { name: "Title", value: `${song.name}`, inline: true },
      { name: "Author", value: `${song.uploader.name}`, inline: true },
      { name: "Time", value: `${song.formattedDuration}`, inline: true },
      { name: "Views", value: `${song.views}`, inline: true },
      { name: "Thumbnail", value: "[Click](" + song.thumbnail + ")", inline: true },
      { name: "Video", value: "[Click](" + song.url + ")", inline: true }
    )
    .setColor("Aqua")
    .setImage(
      `${
        song.thumbnail ??
        "https://cdn.discordapp.com/attachments/997487955860009038/1009062859889705062/Baslksz-1.png"
      }`
    );
}

/**
 * @param {Queue} queue
 */
function nowPlayingEmbed(queue) {
  const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 20);
  const embed = new EmbedBuilder()
    .setColor("Purple")
    .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
    .addFields(
      {
        name: "Music Author:",
        value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`,
        inline: true,
      },
      { name: "Member:", value: `${queue.songs[0].member}`, inline: true },
      { name: "Voice:", value: `${queue.volume}%`, inline: true },
      { name: "Views:", value: `${queue.songs[0].views}`, inline: true },
      { name: "Like:", value: `${queue.songs[0].likes}`, inline: true },
      { name: "Filtre:", value: `${queue.filters.names.join(", ") || "Normal"}`, inline: true },
      {
        name: `Video Time: **[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]**`,
        value: ` ${
          "<:circle:1033057941647016056>".repeat(part) +
          "🎵" +
          "<:asd:1033046466438107158>".repeat(20 - part)
        }`,
        inline: false,
      }
    );
  return embed;
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function nowPlaying(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);

  const embed = nowPlayingEmbed(queue);
  return interaction.followUp({ embeds: [embed] });
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function pause(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const data = db.fetch(`music_${interaction.guild.id}`);

  if (!data) return interaction.followUp("Music data is not available.");

  const user = data.user;

  if (interaction.user.id !== user)
    return interaction.followUp("Only the person who started the music can pause.");

  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);
  if (queue.paused) return interaction.followUp("The music is already stopped.");

  distube.pause(interaction);

  if (interaction instanceof ButtonInteraction) {
    await interaction.message.edit({ components: stopRows });
  }

  return interaction.followUp("Successfully paused your song.");
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function skip(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const data = db.fetch(`music_${interaction.guild.id}`);

  if (!data) return interaction.followUp("Music data is not available.");

  const user = data.user;

  if (interaction.user.id !== user)
    return interaction.followUp("Only the person who started the music can skip.");

  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);
  if (queue.songs.length === 1) return interaction.followUp("No song found in the queue!");

  const song = await distube.skip(interaction);

  if (interaction instanceof ButtonInteraction) {
    const embed = songEmbed(song);
    await interaction.message.edit({ embeds: [embed] });
  }

  return interaction.followUp("Successfully skipped the song.");
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function loop(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const data = db.fetch(`music_${interaction.guild.id}`);

  if (!data) return interaction.followUp("Music data is not available.");

  const user = data.user;

  if (interaction.user.id !== user)
    return interaction.followUp("Only the person who started the music can loop.");

  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);

  const repeat = queue.repeatMode;
  distube.setRepeatMode(interaction, repeat === RepeatMode.SONG ? 0 : 1);
  const repeatMessage =
    repeat === RepeatMode.SONG
      ? "The song was set to not loop."
      : "The song was successfully looped.";

  return interaction.followUp(repeatMessage);
}

/**
 * @param {ChatInputCommandInteraction<"cached"> |
 * ButtonInteraction<"cached">} interaction
 */
async function resume(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const data = db.fetch(`music_${interaction.guild.id}`);

  if (!data) return interaction.followUp("Music data is not available.");

  const user = data.user;

  if (interaction.user.id !== user)
    return interaction.followUp("Only the person who started the music can loop.");

  const queue = distube.getQueue(interaction);

  if (!queue) return interaction.followUp(`There is no song on the list yet.`);
  if (!queue.paused) return interaction.followUp("The music is already playing.");

  queue.resume();

  if (interaction instanceof ButtonInteraction) {
    await interaction.message.edit({ components: playRows });
  }

  return interaction.followUp("Successfully reopened your song.");
}

module.exports = {
  setVolume,
  setSpeed,
  setSlow,
  setBass,
  nowPlaying,
  pause,
  skip,
  songEmbed,
  loop,
  resume,
};
