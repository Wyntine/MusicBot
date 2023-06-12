// @ts-check

const { distube } = require("../components/client");
const { Command, db } = require("../components/files");
const { playRows } = require("../components/static");
const { songEmbed } = require("../components/commandData");

module.exports = new Command({
  data: (builder) =>
    builder
      .setName("play")
      .setDescription("🎵| Play Music!")
      .addStringOption((option) =>
        option.setName("name").setDescription("Song Name?").setRequired(true)
      ),
  async run(interaction) {
    await interaction.deferReply();
    const string = interaction.options.getString("name", true);
    const voiceChannel = interaction.member.voice.channel;
    const channelId = interaction.channelId;

    if (!voiceChannel) return interaction.followUp({ content: "You are not on an audio channel!" });

    await distube.voices.join(voiceChannel);
    await distube.play(voiceChannel, string, { member: interaction.member });
    const tracks = distube.getQueue(interaction);

    if (!tracks)
      return interaction.reply({ content: "Şarkı oynatılırken hata oluştu.", ephemeral: true });

    const [first] = tracks.songs;

    if (!first || tracks.songs.length > 1) return interaction.followUp("🎵 | Music added.");

    const embed = songEmbed(first);
    const message = await interaction.followUp({ embeds: [embed], components: playRows });
    db.set(`music_${interaction.guild.id}`, {
      kanal: channelId,
      mesaj: message.id,
      muzik: string,
      user: interaction.user.id,
      başlık: first.name,
      yükleyen: first.uploader.name,
      süre: tracks.duration,
      görüntülenme: first.views,
      thumb: first.thumbnail,
      video: first.url,
    });
  },
});
