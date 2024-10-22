const { PermissionsBitField } = require('discord.js');

function checkPermissions(interaction) {
  if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
    return false;
  }
  return true;
}

module.exports = { checkPermissions };
