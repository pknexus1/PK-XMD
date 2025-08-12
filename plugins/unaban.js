const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "unbann",
    desc: "Send a formatted WhatsApp unban appeal message.",
    category: "main",
    filename: __filename
}, async (conn, m, store) => {
    try {
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Support\nORG:WhatsApp LLC\nTEL:+1-650-555-5555\nEND:VCARD`;

        const appealText = `*📢 WhatsApp Unban Appeal*\n\nHello WhatsApp Support,\n\nMy account was recently banned. I believe this was a mistake as I have not violated the Terms of Service. Kindly review my case and reinstate my account.\n\nThank you for your assistance.\n\n*— Sent via ${config.BOT_NAME}*`;

        await conn.sendMessage(m.chat, {
            text: appealText,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "WhatsApp Support Appeal",
                    body: "Forward this message to WhatsApp Support to request unban.",
                    thumbnailUrl: config.LOGO_URL,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: "https://wa.me/254785392165"
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 1
                }
            },
            quoted: {
                key: {
                    fromMe: false,
                    participant: "0@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                },
                message: {
                    contactMessage: {
                        vcard: vcard,
                        displayName: "WhatsApp Support"
                    }
                }
            }
        });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: "❌ Error sending unban request." });
    }
});
