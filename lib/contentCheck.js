const zeroWidthPattern = /[\u200B\u200C\u200D\uFEFF]/g;

function hasValidContent(message) {
  return (
    message.content &&
    message.content.trim() !== '' &&
    !zeroWidthPattern.test(message.content)  
  );
}

function isInvalidContent(message) {
  return (
    !hasValidContent(message) && 
    (message.embeds.length > 0 || message.attachments.size > 0)
  );
}

async function replyInvalidContent(interaction) {
  return await interaction.reply({
    content: '<:error:1302169165905526805> メッセージが見つかりません',
    ephemeral: true,
  });
}

module.exports = { isInvalidContent, replyInvalidContent, hasValidContent };