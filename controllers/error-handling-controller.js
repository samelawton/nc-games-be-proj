
exports.error404Statuses = (error, request, response, next) => {
    response.status(404).send({msg: 'not found'})
}

exports.error500Statuses = (error, request, response, next) => {
    response.status(500).send({msg: 'server error'})
}
