module.exports = function(req) {
    let proto = req.connection.encrypted || process.env.SSL === 'true' ? 'https' : 'http';
    return proto.split(/\s*,\s*/)[0];
};
