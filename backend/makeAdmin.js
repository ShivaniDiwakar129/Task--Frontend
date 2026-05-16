const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const result = await User.updateMany(
            {},
            { $set: { role: 'admin' } }
        );
        console.log('Update result:', result);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
