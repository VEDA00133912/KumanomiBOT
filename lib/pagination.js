const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, DiscordAPIError } = require('discord.js');

async function buttonPages(interaction, pages) {
    if (!interaction) throw new Error('<:error:1302169165905526805> interactionが提供されていません');
    if (!pages || !Array.isArray(pages)) throw new Error('<:error:1302169165905526805> ページの引数が無効です');
    await interaction.deferReply();

    const gifUrl = 'https://ul.h3z.jp/bPSpdaVW.png'; 

    if (pages.length === 1) {
        pages[0].setImage(gifUrl);
        return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });
    }

    let index = 0;
    const buttons = [
        new ButtonBuilder().setCustomId('prev').setEmoji('◀').setStyle(ButtonStyle.Primary).setDisabled(true),
        new ButtonBuilder().setCustomId('home').setLabel('最初に戻る').setStyle(ButtonStyle.Danger).setDisabled(true),
        new ButtonBuilder().setCustomId('next').setEmoji('▶').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('delete').setLabel('削除').setStyle(ButtonStyle.Danger)
    ];

    const buttonRow = new ActionRowBuilder().addComponents(buttons);

    const initialEmbed = pages[index];
    if (index === 0) {
        initialEmbed.setImage(gifUrl); 
    }
    await interaction.editReply({ embeds: [initialEmbed], components: [buttonRow], fetchReply: true });

    const currentPage = await interaction.fetchReply();

    const collector = currentPage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60 * 1000 });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) return i.reply({ content: '<:error:1302169165905526805> あなたは操作できません', ephemeral: true });
        await i.deferUpdate();

        try {
            if (i.customId === 'prev') index--;
            else if (i.customId === 'home') index = 0;
            else if (i.customId === 'next') index++;
            else if (i.customId === 'delete') { 
                await currentPage.delete();
                collector.stop('deleted');
                return;
            }

            const embedToEdit = pages[index];
            if (index === 0) {
                embedToEdit.setImage(gifUrl);
            } else {
                embedToEdit.setImage(null);
            }
            await currentPage.edit({ embeds: [embedToEdit], components: [buttonRow] });

            buttons[0].setDisabled(index === 0);
            buttons[1].setDisabled(index === 0);
            buttons[2].setDisabled(index === pages.length - 1);

            collector.resetTimer();
        } catch (error) {
            console.error(error);
        }
    });

    collector.on('end', async (_, reason) => {
        if (reason !== 'messageDelete' && reason !== 'deleted') {
            try {
                await currentPage.delete();
            } catch (error) {
                if (error instanceof DiscordAPIError && error.code === 50001) { 
                    await interaction.followUp({ content: '<:error:1302169165905526805> このチャンネルにアクセスする権限がありません。', ephemeral: true });
                } else {
                    console.error('endエラー');
                }
            }
        }
    });

    return currentPage;
}

module.exports = buttonPages;