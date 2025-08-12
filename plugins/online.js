const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "online",
  desc: "List all members currently online in the group",
  category: "group",
  filename: __filename
}, async (conn, m, store) => {
  try {
    if (!m.isGroup) return m.reply("❌ This command only works in groups.");

    const groupMetadata = await conn.groupMetadata(m.chat);
    const participants = groupMetadata.participants.map(p => p.id);

    let onlineMembers = [];
    
    // Fake verified vCard quoted message
    const fakeContact = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: config.BOT_NAME || "PK-XMD",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.BOT_NAME || "PK-XMD"}\nORG:WhatsApp\nTEL;type=CELL;type=VOICE;waid=254768391601:+254 768 391 601\nEND:VCARD`
        }
      }
    };

    m.reply("⏳ Scanning for online members...", fakeContact);

    // Subscribe to all members' presence
    for (const jid of participants) {
      await conn.presenceSubscribe(jid);
    }

    // Wait for 5 seconds to collect online members
    await new Promise(resolve => {
      const handler = (pres) => {
        if (pres.presences) {
          for (const [id, presence] of Object.entries(pres.presences)) {
            if (presence.lastKnownPresence === "composing" || presence.lastKnownPresence === "available") {
              if (!onlineMembers.includes(id)) onlineMembers.push(id);
            }
          }
        }
      };

      conn.ev.on("presence.update", handler);
      setTimeout(() => {
        conn.ev.off("presence.update", handler);
        resolve();
      }, 5000);
    });

    let text = `📡 *Online Members in ${groupMetadata.subject}*\n\n`;
    if (onlineMembers.length === 0) {
      text += "No members are currently online.";
    } else {
      text += onlineMembers.map((id, i) => `★ ${i + 1}. @${id.split("@")[0]}`).join("\n");
    }

    await conn.sendMessage(m.chat, {
      text,
      mentions: onlineMembers,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.CHANNEL || "120363297707316669@newsletter",
          newsletterName: config.BOT_NAME || "PK-XMD",
          serverMessageId: -1
        },
        externalAdReply: {
          title: config.BOT_NAME || "PK-XMD",
          body: "Powered by Pkdriller",
          thumbnailUrl: config.LOGO_URL || "",
          sourceUrl: config.GROUP_LINK || "https://whatsapp.com/channel/0029Va5Vb7K6QwOKroGJeC3C",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fakeContact });

  } catch (e) {
    console.error(e);
    m.reply("❌ An error occurred while checking online members.");
  }
});
                                
