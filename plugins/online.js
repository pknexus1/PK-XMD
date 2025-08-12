const config = require('../config');
const { cmd } = require('../command');
const moment = require('moment-timezone');

cmd({
    pattern: "online",
    desc: "Show recently active members in the group.",
    category: "group",
    react: "🟢",
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, groupMetadata, participants, reply, store }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        const now = Date.now();
        const activeWindow = 5 * 60 * 1000; // 5 minutes

        // Get messages from store for this group
        let recentMessages = store.messages[from]?.array || [];
        let activeMembers = new Set();

        for (let msg of recentMessages) {
            if (msg.messageTimestamp && (now - (msg.messageTimestamp.low || msg.messageTimestamp) * 1000) <= activeWindow) {
                if (msg.key?.participant) {
                    activeMembers.add(`@${msg.key.participant.split('@')[0]}`);
                }
            }
        }

        let text;
        if (activeMembers.size === 0) {
            text = "📴 No members have been active in the last 5 minutes.";
        } else {
            text = `🟢 *Recently Active Members (${activeMembers.size}):*\n${[...activeMembers].join("\n")}`;
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
        }, {
            quoted: {
                key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
                message: {
                    contactMessage: {
                        displayName: "WhatsApp",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp\nORG:Meta\nTEL;type=CELL;type=VOICE;waid=0:+0\nEND:VCARD`
                    }
                }
            }
        });

    } catch (e) {
        console.error("Error in online command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
            
