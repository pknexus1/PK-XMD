const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');

cmd({
    pattern: "requestunban",
    desc: "Generate a random WhatsApp unban request template",
    category: "tools",
    filename: __filename
}, async (conn, m) => {
    try {
        // Fake verified contact as quoted message
        const fakeContact = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "WhatsApp Support",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:WhatsApp Support\nORG:WhatsApp Inc.\nTEL;type=CELL;type=VOICE;waid=19753123456:+1 975-312-3456\nEND:VCARD`
                }
            }
        };

        // Random reasons for unban
        const reasons = [
            "My WhatsApp account was banned by mistake. I always follow the Terms of Service.",
            "I believe my account was restricted due to suspicious activity, but it was not me.",
            "I think my account was flagged incorrectly by the system.",
            "My account got banned unexpectedly. Kindly review and restore access.",
            "I have always used WhatsApp responsibly. Please recheck my case."
        ];

        const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
        const timeNow = moment.tz(config.TIME_ZONE).format("HH:mm:ss");
        const dateNow = moment.tz(config.TIME_ZONE).format("DD/MM/YYYY");

        const unbanTemplate = `📢 *WHATSAPP UNBAN REQUEST TEMPLATE* 📢

🕒 Time: ${timeNow}
📅 Date: ${dateNow}

📄 *Message to send to WhatsApp Support:*
----------------------------------------
To: support@whatsapp.com  
Subject: My WhatsApp Number Ban Appeal  

Hello WhatsApp Support Team,  

${randomReason}  

Phone Number: +[Your Country Code][Your Phone Number]  

Please review and lift the ban.  

Kind regards,  
[Your Name]
----------------------------------------

📌 Copy the above message and send it to *support@whatsapp.com* via email.`;

        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/sa1imb.jpg" },
            caption: unbanTemplate,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    serverMessageId: 999,
                    newsletterName: "PK-XMD Bot Updates"
                },
                externalAdReply: {
                    title: "WhatsApp Unban Request",
                    body: "Use this to appeal your banned account",
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    thumbnailUrl: "https://files.catbox.moe/sa1imb.jpg",
                    sourceUrl: "mailto:support@whatsapp.com"
                }
            }
        }, { quoted: fakeContact });

    } catch (e) {
        console.error(e);
        m.reply("❌ Error generating unban request.");
    }
});
    
