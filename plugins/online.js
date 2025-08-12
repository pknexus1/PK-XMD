const moment = require('moment-timezone');
const config = require('../config');
const { cmd } = require('../command');

// Track last active members globally
global.activeMembers = {};

module.exports = (conn) => {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.key.remoteJid.endsWith('@g.us')) return; // Only track groups
        const sender = msg.key.participant || msg.key.remoteJid;
        const now = Date.now();
        global.activeMembers[msg.key.remoteJid] = global.activeMembers[msg.key.remoteJid] || {};
        global.activeMembers[msg.key.remoteJid][sender] = now;
    });
};

cmd({
    pattern: "online",
    desc: "Show recently active members in the group.",
    react: "🟢",
    category: "group",
    filename: __filename
},
async (conn, mek, m, {
    from, isGroup, participants, reply, args
}) => {
    try {
        if (!isGroup) {
            return reply("❌ This command can only be used in groups.");
        }

        const now = Date.now();
        const activeWindow = (parseInt(args[0]) || 5) * 60 * 1000; // default 5 minutes
        let activeList = [];

        if (global.activeMembers[from]) {
            for (let [jid, lastSeen] of Object.entries(global.activeMembers[from])) {
                if (now - lastSeen <= activeWindow) {
                    activeList.push(`@${jid.split('@')[0]} — ${moment(lastSeen).tz('Africa/Nairobi').format('HH:mm:ss')}`);
                }
            }
        }

        let text;
        if (activeList.length === 0) {
            text = `📴 No members have been active in the last ${activeWindow / 60000} minutes.`;
        } else {
            text = `🟢 *Recently Active Members (${activeList.length}) — Last ${activeWindow / 60000} min:*\n${activeList.join("\n")}`;
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
        console.error(e);
        reply(`❌ Error: ${e}`);
    }
});
    
