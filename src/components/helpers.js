const { ActionRowBuilder, ButtonBuilder, TextInputBuilder } = require("discord.js");

/**
 * @param {ButtonBuilder[]} [buttons]
 * @returns {ActionRowBuilder<ButtonBuilder>}
 */
function createButtonRow(buttons = []) {
  return new ActionRowBuilder().addComponents(buttons);
}

/**
 * @param {TextInputBuilder} [input]
 * @returns {ActionRowBuilder<TextInputBuilder>}
 */
function createTextInputRow(input) {
  return new ActionRowBuilder().addComponents(input);
}

module.exports = {
  createButtonRow,
  createTextInputRow,
};
