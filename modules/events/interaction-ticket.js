const { Events } = require('discord.js');
const ticketHandler = require('../../lib/ticket'); 

module.exports = {
  name: Events.InteractionCreate,  
  async execute(interaction) {
    if (!interaction.isButton()) return;  

    if (interaction.customId === 'create') {
      await ticketHandler.createTicket(interaction);  
    } else if (interaction.customId === 'del') {
      await ticketHandler.deleteTicket(interaction);  
    }
  },
};
