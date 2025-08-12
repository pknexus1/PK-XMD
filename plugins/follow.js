const { cmd } = require('../command');
const config = require('../config');

const channelJid = "120363288304618280@newsletter"; 
const channelLink = "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x";
let followedUsers = new Set(); // Simple in-memory store (use DB if needed)

cmd({
  pattern: "follow",
  desc: "Send the bot's WhatsApp Channel link to follow",
  category: "main",
  filename: __filename
}, async (conn, m, store, { from, sender, reply }) => {
  try {
    if (followedUsers.has(sender)) {
      return reply("✅ You have already followed the channel!");
    }

    await conn.sendMessage(from, {
      text: `📢 *Official PK-XMD Channel*\n\nJoin now to get updates and latest bot news!\n\n🔗 ${channelLink}`,
      contextInfo: {
        externalAdReply: {
          title: "PK-XMD Official Channel",
          body: "Tap to follow the channel",
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/yvqhvk.jpg",
          sourceUrl: channelLink
        }
      }
    }, { quoted: m });

    followedUsers.add(sender);

  } catch (err) {
    console.error(err);
    reply("❌ Failed to send channel link.");
  }
});
