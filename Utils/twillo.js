const twilio = require('twilio')
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendMessageToMob = ({msgBody, toNo, fromNo = process.env.TWILIO_FROM_NO}) => {
    client.messages.create({
        body: msgBody,
        to: toNo,
        from: fromNo
    }).then((message) => console.log(message.sid)).catch((err) => {
        console.log(err)
    })
}

module.exports = {
    sendMessageToMob,
}

