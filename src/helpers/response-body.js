

exports.responseBody = body => {
    const { code, message, data } = body;
    const obj = Object.assign({}, {
        code,
        message,
        data
    });

    return obj;
}