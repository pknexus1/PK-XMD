const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "follow",
    desc: "Follow PKDRILLER's WhatsApp Channel",
    category: "system",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        const channelJid = "120363288304618280@newsletter";
        const channelLink = "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x";

        // Fake verified contact (quoted message)
        const fakeContact = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: config.ownername || "PK-XMD",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownername || "PK-XMD"}\nORG:WhatsApp\nTEL;type=CELL;type=VOICE;waid=${config.ownernumber || "254700000000"}:+${config.ownernumber || "254700000000"}\nEND:VCARD`
                }
            }
        };

        // Check if already following
        const isFollowing = await conn.newsletterMetadata(channelJid).then(meta => meta.state === "SUBSCRIBED");

        if (isFollowing) {
            await conn.sendMessage(from, {
                text: `✅ Already following my channel!\n\n📢 ${channelLink}`,
                contextInfo: {
                    externalAdReply: {
                        title: "PKDRILLER Updates",
                        body: "Already Following ✅",
                        mediaType: 1,
                        thumbnailUrl: "https://files.catbox.moe/yvqhvk.jpg",
                        sourceUrl: channelLink
                    }
                }
            }, { quoted: fakeContact });
        } else {
            await conn.newsletterFollow(channelJid);
            await conn.sendMessage(from, {
                text: `🎉 Successfully followed my channel!\n\n📢 ${channelLink}`,
                contextInfo: {
                    externalAdReply: {
                        title: "PKDRILLER Updates",
                        body: "Followed Successfully 🎯",
                        mediaType: 1,
                        thumbnailUrl: "https://files.catbox.moe/yvqhvk.jpg",
                        sourceUrl: channelLink
                    }
                }
            }, { quoted: fakeContact });
        }
    } catch (err) {
        console.error(err);
        reply("❌ Failed to follow the channel.");
    }
});
