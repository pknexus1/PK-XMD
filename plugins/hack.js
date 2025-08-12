const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Playful PK-XMD themed hacking animation (for owner use only).",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, senderNumber, reply }) => {
    try {
        // Bot owner check
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("⛔ Only *PK-XMD Owner* can run this command.");
        }

        const steps = [
            "🛰️ *[PK-XMD CYBER SUITE] INITIALIZING...*",
            "💾 Loading stealth modules... [████░░░░░░░░░░] 15%",
            "🌐 Connecting to *PK-XMD Secure Nodes*...",
            "🔍 Scanning vulnerabilities... [██████░░░░░░░] 35%",
            "💻 Bypassing multi-layer firewalls...",
            "⚙️ Injecting *Custom PK-XMD Exploits*... [█████████░░░] 60%",
            "📡 Establishing encrypted backdoor...",
            "🛠 Deploying payload... [█████████████░] 85%",
            "🔓 **SYSTEM BREACH SUCCESSFUL!**",
            "🚀 Exfiltrating target data packets...",
            "📦 Packaging data → PK-XMD Quantum Storage...",
            "✅ Operation Complete — *PK-XMD BlackOps Protocol* Executed",
            "⚠️ _Simulation for entertainment purposes only_"
        ];

        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Final PK-XMD Signature
        await conn.sendMessage(from, {
            text: "☣ *PK-XMD CYBER OPS — MISSION ACCOMPLISHED* ☣",
            contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: "PK-XMD Official Channel",
                    serverMessageId: 101
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});
