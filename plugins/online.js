const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "online",
    desc: "List all currently online members in a group",
    react: "🟢",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, senderNumber }) => {
    try {
        if (!isGroup) {
            return reply("❌ This command can only be used in groups.");
        }

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;

        // Filter participants with 'online' status
        const onlineMembers = participants.filter(p => p.isOnline || p.lastSeen === null);

        if (onlineMembers.length === 0) {
            return reply("📭 No members are currently online.");
        }

        let msg = `🟢 *Online Members in ${groupMetadata.subject}*\n\n`;
        onlineMembers.forEach((member, i) => {
            const number = member.id.split('@')[0];
            msg += `${i + 1}. @${number}\n`;
        });

        // Send with fake verified vCard as quoted message
        await conn.sendMessage(from, {
            text: msg,
            mentions: onlineMembers.map(u => u.id),
            contextInfo: {
                mentionedJid: onlineMembers.map(u => u.id),
                quotedMessage: {
                    contactMessage: {
                        displayName: "PK-XMD",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:PK-XMD\nORG:WhatsApp\nTEL;type=CELL;type=VOICE;waid=${senderNumber}:${senderNumber}\nEND:VCARD`
                    }
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363297733356905@newsletter",
                    serverMessageId: 999,
                    newsletterName: "PK-XMD Official"
                },
                externalAdReply: {
                    title: "PK-XMD Online List",
                    body: "Powered by Pkdriller",
                    thumbnailUrl: config.LOGO_URL,
                    sourceUrl: config.CHANNEL_URL,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
