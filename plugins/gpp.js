const { cmd } = require("../command");
const Jimp = require("jimp");

cmd({
  pattern: "gpp",
  alias: ["setgpp", "groupdp"],
  react: "🖼️",
  desc: "Set full image as group profile picture",
  category: "group",
  filename: __filename
}, async (client, message, match, { from, isGroup, isAdmins, isBotAdmins }) => {
  try {
    if (!isGroup) {
      return await client.sendMessage(from, { text: "*📛 This command can only be used in groups.*" }, { quoted: message });
    }

    if (!isAdmins) {
      return await client.sendMessage(from, { text: "*📛 Only group admins can use this command.*" }, { quoted: message });
    }

    if (!isBotAdmins) {
      return await client.sendMessage(from, { text: "*📛 I need admin rights to change the group profile picture.*" }, { quoted: message });
    }

    if (!message.quoted || !message.quoted.mtype || !message.quoted.mtype.includes("image")) {
      return await client.sendMessage(from, { text: "*⚠️ Please reply to an image to set as group profile picture*"}, { quoted: message });
    }

    await client.sendMessage(from, { text: "*⏳ Processing image, please wait...*" }, { quoted: message });

    const imageBuffer = await message.quoted.download();
    const image = await Jimp.read(imageBuffer);

    // Image processing pipeline
    const blurredBg = image.clone().cover(640, 640).blur(10);
    const centeredImage = image.clone().contain(640, 640);
    blurredBg.composite(centeredImage, 0, 0);
    const finalImage = await blurredBg.getBufferAsync(Jimp.MIME_JPEG);

    // Update group profile picture
    await client.updateProfilePicture(from, finalImage);

    await client.sendMessage(from, { text: "*✅ Group profile picture updated successfully!*" }, { quoted: message });

  } catch (error) {
    console.error("gpp Error:", error);
    await client.sendMessage(from, { text: `*❌ Error updating group profile picture:*\n${error.message}` }, { quoted: message });
  }
});
