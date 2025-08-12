const { cmd } = require('../command');
const config = require('../config');

let antibugStatus = false;

// Simple bug keywords/signatures
const bugPatterns = [
  /‏‏‎‏‏‎‏‏‎/g, // invisible chars
  /🖤/g, // example crash emoji
  /╭━/g, // spam lines
  /bug|lag|freeze|crash|spam/i, // keywords
  /https:\/\/wa\.me\//i, // mass tag links
  /|🍷|🛡️/g // weird crashy symbols
];

cmd({
  pattern: "antibug",
  desc: "Enable or disable antibug system",
  category: "system",
  filename: __filename
}, async (conn, m, store, { from, q, reply, isGroup }) => {
  try {
    if (!q) {
      return reply(`⚙ Usage:\n.antibug on — enable antibug\n.antibug off — disable antibug\n\nCurrent: ${antibugStatus ? "✅ ON" : "❌ OFF"}`);
    }

    if (q.toLowerCase() === "on") {
      antibugStatus = true;
      await conn.sendMessage(from, {
        text: `🛡 Antibug activated.\nNow monitoring all chats for spam/bug attempts.`,
        contextInfo: {
          quotedMessage: {
            contactMessage: {
              vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:WhatsApp Verified ✅\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`
            }
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.CHANNEL_JID,
            newsletterName: config.BOT_NAME,
            serverMessageId: -1
          }
        }
      });
    } else if (q.toLowerCase() === "off") {
      antibugStatus = false;
      await conn.sendMessage(from, {
        text: `🚫 Antibug deactivated.\nNo longer monitoring chats.`,
        contextInfo: {
          quotedMessage: {
            contactMessage: {
              vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:WhatsApp Verified ✅\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`
            }
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.CHANNEL_JID,
            newsletterName: config.BOT_NAME,
            serverMessageId: -1
          }
        }
      });
    } else {
      reply(`❌ Invalid option. Use ".antibug on" or ".antibug off".`);
    }
  } catch (err) {
    console.error(err);
    reply("⚠ Error toggling antibug.");
  }
});

// Message listener
cmd({
  on: "message"
}, async (conn, m) => {
  if (!antibugStatus) return;
  try {
    const text = m.body || m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    if (!text) return;

    // Check if message matches bug patterns
    if (bugPatterns.some(p => p.test(text))) {
      const sender = m.sender;
      const isGroup = m.isGroup;
      
      // Delete the message
      await conn.sendMessage(m.chat, { delete: m.key });

      if (isGroup) {
        try {
          await conn.groupParticipantsUpdate(m.chat, [sender], "remove");
        } catch {}
      }

      // Block the sender
      try {
        await conn.updateBlockStatus(sender, "block");
      } catch {}

      // Log to owner
      await conn.sendMessage(config.OWNER_NUMBER + "@s.whatsapp.net", {
        text: `🚨 *Antibug Triggered*\n\n👤 Sender: @${sender.split("@")[0]}\n💬 Message: ${text.slice(0, 200)}...`,
        mentions: [sender]
      });
    }
  } catch (err) {
    console.error("Antibug error:", err);
  }
});
