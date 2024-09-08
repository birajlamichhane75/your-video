class ApiResponse {
    constructor(StatusCode, data, message = "Success"){
        this.StatusCode = StatusCode,
        this.data = data,
        this.message = message,
        this.success = StatusCode
    }
}

// res.json(ApiResponse()) this res.json implecitely convert class notation into json format


export default ApiResponse