const { ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

async function buttonPages(interaction, pages) {
    if (!interaction) throw new Error("interactionが提供されていません");
    if (!pages || !Array.isArray(pages)) throw new Error("ページの引数が無効です");

    await interaction.deferReply();

    if (pages.length === 1) {
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
    const currentPage = await interaction.editReply({ embeds: [pages[index]], components: [buttonRow], fetchReply: true });

    const collector = currentPage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60 * 1000 });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) return i.reply({ content: "今は使えません", ephemeral: true });
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

            buttons[0].setDisabled(index === 0);
            buttons[1].setDisabled(index === 0);
            buttons[2].setDisabled(index === pages.length - 1);

            await currentPage.edit({ embeds: [pages[index]], components: [buttonRow] });
            collector.resetTimer();
        } catch (error) {
            let errorMessage = 'ボタン操作中にエラーが発生しました。';

            if (error.code === 50001) {
                errorMessage = 'このメッセージを削除する権限がありません。';
            } else if (error.code === 50013) {
                errorMessage = 'このメッセージがあるチャンネルの閲覧権限がありません。';
            }

            try {
                await i.reply({ content: errorMessage, ephemeral: true });
            } catch (replyError) {
                console.error('エラーメッセージの送信に失敗しました:', replyError);
            }

            if (error.code !== 50001 && error.code !== 50013) {
                 console.error(error);
            }
        }
    });

    collector.on('end', async (_, reason) => {
        if (reason !== 'messageDelete' && reason !== 'deleted') { 
            try {
                await currentPage.delete();
            } catch (error) {
                let errorMessage = 'メッセージ削除中にエラーが発生しました。';

                if (error.code === 50001) {
                    errorMessage = 'このメッセージを削除する権限がありません。';
                } else if (error.code === 50013) {
                    errorMessage = 'このメッセージがあるチャンネルの閲覧権限がありません。';
                }

                try {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                } catch (followUpError) {
                    console.error('フォローアップメッセージの送信に失敗しました:', followUpError);
                }

                if (error.code !== 50001 && error.code !== 50013) {
                 console.error(error);
                }
            }
        }
    });

    return currentPage;
}

module.exports = buttonPages;
