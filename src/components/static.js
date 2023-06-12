// @ts-check

const {
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { createButtonRow, createTextInputRow } = require("./helpers");

const playRows = [
  createButtonRow([
    new ButtonBuilder().setEmoji("🎵").setStyle(ButtonStyle.Secondary).setCustomId("dur"),
    new ButtonBuilder().setEmoji("🔊").setStyle(ButtonStyle.Secondary).setCustomId("volume"),
    new ButtonBuilder().setEmoji("⏩").setStyle(ButtonStyle.Secondary).setCustomId("skip"),
    new ButtonBuilder().setEmoji("🌀").setStyle(ButtonStyle.Secondary).setCustomId("loop"),
    new ButtonBuilder().setEmoji("❓").setStyle(ButtonStyle.Secondary).setCustomId("soru"),
  ]),
  createButtonRow([
    new ButtonBuilder().setEmoji("🥁").setStyle(ButtonStyle.Secondary).setCustomId("bassboost"),
    new ButtonBuilder()
      .setEmoji("<:slowmode:740952943460614185>")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("slowmode"),
    new ButtonBuilder().setEmoji("💨").setStyle(ButtonStyle.Secondary).setCustomId("fast"),
    new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/altyapilar"),
  ]),
];

const stopRows = [
  createButtonRow([
    new ButtonBuilder().setEmoji("🎵").setStyle(ButtonStyle.Danger).setCustomId("devam"),
  ]),
];

const volumeForm = new ModalBuilder()
  .setCustomId("form")
  .setTitle("Raven - Music Bot!")
  .addComponents(
    createTextInputRow(
      new TextInputBuilder()
        .setCustomId("setvolume")
        .setLabel("Volume")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(3)
        .setPlaceholder("1 - 100")
        .setRequired(true)
    )
  );

module.exports = {
  playRows,
  stopRows,
  volumeForm,
};
