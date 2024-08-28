class ApiError extends Error{
    constructor(statusCode, error = [], message="Something went wrong"){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.success = false
        this.error = error
}

}

export {ApiError}