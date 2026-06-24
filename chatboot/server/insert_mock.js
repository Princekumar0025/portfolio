const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Prince').then(async () => {
    const msg = {
        sessionId: '1772358606370', // Same sessionId as the previous successful chat
        sender: 'bot',
        text: "Here is the button component you requested:\n\n```html\n<!DOCTYPE html>\n<html>\n<head>\n<style>\n.premium-btn {\n  background: linear-gradient(135deg, #6366f1, #a855f7);\n  color: white;\n  padding: 12px 24px;\n  border-radius: 9px;\n  border: none;\n  font-weight: bold;\n  cursor: pointer;\n}\n</style>\n</head>\n<body>\n  <button class=\"premium-btn\">Premium Artifact Button</button>\n</body>\n</html>\n```\n\nLet me know if you need any changes!",
        timestamp: new Date()
    };

    await mongoose.connection.db.collection('messages').insertOne(msg);
    console.log('Mock stored');
    process.exit(0);
}).catch(console.error);
