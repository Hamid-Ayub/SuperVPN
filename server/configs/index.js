const mongoose = require('mongoose')
const sgMail = require('@sendgrid/mail')

const mongoURL = 'mongodb://localhost:27017/strongvpn';

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const dbConnect = () => {
    mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => {
            console.log("\n");
            console.log('DB OK');
            console.log("\n");
        })
        .catch((err) => {
            console.log(err);
        });
};

sgMail.setApiKey('<SENDGRID API KEY>')

module.exports = {
  dbConnect,
  sgMail
}
