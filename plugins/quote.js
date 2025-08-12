const axios = require("axios");
const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "quote",
  desc: "Get a random motivational quote",
  category: "fun",
  filename: __filename
}, async (conn, m) => {
  try {
    // Function to fetch quote from APIs
    const fetchQuote = async () => {
      try {
        const res = await axios.get("https://zenquotes.io/api/random");
        return `${res.data[0].q} — ${res.data[0].a}`;
      } catch {
        const res2 = await axios.get("https://api.quotable.io/random");
        return `${res2.data.content} — ${res2.data.author}`;
      }
    };

    const quote = await fetchQuote();

    // Fake verified contact
    const fakeContact = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: config.botname,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${config.botname}\nORG:Meta;WA Business\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
        }
      }
    };

    await conn.sendMessage(m.chat, {
      text: `💡 *Quote of the Day:*\n\n${quote}`,
      contextInfo: {
        externalAdReply: {
          title: "📢 PK-XMD QUOTES",
          body: "Stay motivated!",
          mediaType: 1,
          thumbnailUrl: config.menuimg,
          sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x"
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          newsletterName: "PK-XMD Official",
          serverMessageId: 100
        }
      }
    }, { quoted: fakeContact });

  } catch (err) {
    console.error(err);
    m.reply("❌ Failed to fetch quote. Please try again later.");
  }
});
          
