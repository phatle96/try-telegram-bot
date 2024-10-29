const fs = require('fs');

module.exports = (bot) => {
    // Function to get the latest email content for a given email address
    function getLatestEmailContent(emailAddress) {
        if (!fs.existsSync('emails.json')) {
            return null;
        }

        const emails = JSON.parse(fs.readFileSync('emails.json'));
        
        // Find emails matching the address, sorted by the latest timestamp
        const userEmails = emails
            .filter((email) => email.emailAddress === emailAddress)
            .sort((a, b) => b.timestamp - a.timestamp);
        
        // Return the latest email content if found
        return userEmails.length > 0 ? userEmails[0].content : null;
    }

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const emailAddress = msg.text.trim().toLowerCase();

        // Validate email format
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailAddress)) {
            // Fetch the latest email content for the address
            const latestContent = getLatestEmailContent(emailAddress);

            if (latestContent) {
                bot.sendMessage(chatId, `Here is your latest email content:\n\n${latestContent}`);
            } else {
                bot.sendMessage(chatId, `No recent emails found for ${emailAddress}.`);
            }
        } else {
            bot.sendMessage(chatId, 'Please send a valid email address to retrieve your latest email content.');
        }
    });
};