const { cmd } = require('../command');

cmd({
    pattern: "newsletter",
    desc: "Displays the @newsletter ID of the current channel",
    category: "tools",
    react: "📰",
    filename: __filename
},
async (conn, mek, m) => {
    const newsletterJid = m.chat;

    console.log(`[NEWSLETTER] Command used in: ${newsletterJid}`);

    if (!newsletterJid.endsWith("@newsletter")) {
        return conn.sendMessage(newsletterJid, {
            text: "📛 This command must be used inside a WhatsApp channel (@newsletter)."
        }, { quoted: mek });
    }

    if (!newsletterJid.startsWith("120")) {
        return conn.sendMessage(newsletterJid, {
            text: "⚠️ This does not appear to be a valid WhatsApp channel ID."
        }, { quoted: mek });
    }

    const now = new Date().toLocaleString();

    await conn.sendMessage(newsletterJid, {
        text: `📢 *PK-XMD Channel ID:*\n\n\`\`\`${newsletterJid}\`\`\`\n\n🕒 *Executed on:* ${now}`
    }, { quoted: mek });

    // Forward simulation for PK-XMD
    const pkxmdNewsletterJid = '120363288304618280@newsletter';
    const pkxmdNewsletterName = 'PK-XMD Official Channel';
    const serverMessageId = 101;
    const message = `Forwarded from *${pkxmdNewsletterName}*:\n\nChannel ID: \`${newsletterJid}\``;

    await conn.sendMessage(
        newsletterJid,
        {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: pkxmdNewsletterJid,
                    newsletterName: pkxmdNewsletterName,
                    serverMessageId: serverMessageId
                }
            }
        },
        { quoted: mek }
    );
});
