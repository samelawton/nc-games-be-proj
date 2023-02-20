exports.error500Statuses = (error, request, response, next) => {
    console.log('The error is >>> ' + error);
    response.status(500).send({msg: 'server error'})
}
