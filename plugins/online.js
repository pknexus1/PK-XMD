const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "online",
    desc: "Check all online members in the group.",
    category: "group",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, groupMetadata, participants, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        let onlineMembers = [];
        for (let user of participants) {
            try {
                const presence = await conn.fetchPresence(user.id);
                if (presence && presence !== "unavailable") {
                    onlineMembers.push(`@${user.id.split('@')[0]}`);
                }
            } catch {
                // Ignore if presence fetch fails
            }
        }

        let text;
        if (onlineMembers.length === 0) {
            text = "📴 No members are currently online.";
        } else {
            text = `🟢 *Online Members (${onlineMembers.length}):*\n${onlineMembers.join("\n")}`;
        }

        await conn.sendMessage(from, {
            text,
            mentions: participants.map(p => p.id),
            contextInfo: {
                mentionedJid: participants.map(p => p.id),
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363288304618280@newsletter',
                    newsletterName: "PK-XMD UPDATES",
                    serverMessageId: 143
                }
            }
        }, { quoted: {
            key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
            message: {
                contactMessage: {
                    displayName: "WhatsApp",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:Meta\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`
                }
            }
        }});

    } catch (e) {
        console.error("Error in online command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
