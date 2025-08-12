const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "quote",
  desc: "Get a random inspirational quote",
  category: "fun",
  filename: __filename
}, async (conn, m) => {
  try {
    // Fetch random quote
    let res = await axios.get("https://api.quotable.io/random");
    let data = res.data;

    // Prepare fake verified vCard
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:WhatsApp;\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`;

    // Context info with forwardedNewsletterMessageInfo
    let contextInfo = {
      quotedMessage: {
        contactMessage: {
          displayName: "WhatsApp",
          vcard: vcard
        }
      },
      forwardingScore: 9999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363288304618280@newsletter", // Your channel JID
        serverMessageId: null,
        newsletterName: "PK-XMD Official Updates"
      },
      externalAdReply: {
        title: "📢 PK-XMD Official Channel",
        body: "Tap to follow for updates",
        thumbnailUrl: config.THUMBNAIL,
        sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    };

    // Send message
    await conn.sendMessage(m.chat, {
      text: `💡 *${data.content}*\n\n— ${data.author}`,
      contextInfo
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("❌ Failed to fetch quote. Please try again later.");
  }
});
