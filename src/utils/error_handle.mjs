export function handleServerError(res, error){
    console.error(`Ha ocurrido un error: ${error}`);

    return res.status(500).json({
        success : false,
        statusCode : 500,
        message : 'Se ha producido un error en el servidor, intenta de nuevo mas tarde o contacta a soporte'
    });
}