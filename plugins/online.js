const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "online",
  desc: "Check online members in the group",
  category: "group",
  filename: __filename
}, async (conn, m, store, { from, isGroup, participants, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command works in groups only.");

    const onlineMembers = [];
    const groupMetadata = await conn.groupMetadata(from);

    // Subscribe & check each participant
    for (let member of groupMetadata.participants) {
      try {
        await conn.presenceSubscribe(member.id); 
        // Wait a bit to let WhatsApp send presence update
        await new Promise(res => setTimeout(res, 500));

        const pres = store.presences?.[member.id]?.[from];
        if (pres?.lastKnownPresence === 'available') {
          onlineMembers.push(member.id);
        }
      } catch (err) {
        console.log(`Presence check failed for ${member.id}`, err);
      }
    }

    if (onlineMembers.length === 0) {
      return reply("📴 No members are currently online or visibility is restricted.");
    }

    let text = `✅ *Online Members (${onlineMembers.length}):*\n`;
    onlineMembers.forEach(u => text += `• @${u.split('@')[0]}\n`);

    await conn.sendMessage(from, {
      text,
      mentions: onlineMembers
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    reply("❌ Error checking online members.");
  }
});
