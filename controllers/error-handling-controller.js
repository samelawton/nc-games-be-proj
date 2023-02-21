exports.handleCustomErrors = (error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    } else {
        next(error);
    }
}

exports.error400Status = (error, request, response, next) => {
    response.status(400).send({msg: 'bad request'})
}

exports.error404Statuses = (error, request, response, next) => {
    response.status(404).send({msg: 'not found'})
}

exports.error500Statuses = (error, request, response, next) => {
    response.status(500).send({msg: 'server error'})
}
