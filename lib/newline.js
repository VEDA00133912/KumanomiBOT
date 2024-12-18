
function countNewlines(content) {
  return (content.match(/\n/g) || []).length;
}

function hasExcessiveNewlines(content) {
  return countNewlines(content) > 0; // 改行が1回以上ある場合
}

async function checkNewlinesAndReply(interaction, content) {
  if (hasExcessiveNewlines(content)) {
    await interaction.reply({
      content: '<:error:1302169165905526805> メッセージに改行が含まれています ',
      ephemeral: true,
    });
    return true; // エラー
  }
  return false; // エラーなし
}

module.exports = { countNewlines, hasExcessiveNewlines, checkNewlinesAndReply };
