const {uuid} = require("uuidv4");
const {getTime, format} = require("date-fns");

exports.createEnvelope = (statusCode, statusMessage, type, body) => {
    return {
        "Envelope": body,
        "EnvelopeType": type,
        "InResponseTo": null,
        "RequestId": uuid(),
        "Status": {
            "Code": statusCode,
            "Message": statusMessage
        },
        "Timestamp": getTime(new Date()),
        "TimestampFormatted": format(new Date(), "yyyy-MM-dd HH:mm:ss")
    };
};
