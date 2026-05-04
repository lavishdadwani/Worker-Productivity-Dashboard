import apiConfig from "./config.js"
import request from "../utils/request.js"

const getMetrics = (params) => {
    let queryString = "";
    if (params && Object.keys(params).length > 0) {
        queryString = "?" + request.toRequestParams(params)
    }
    return apiConfig.client.get(`metrics/${queryString}`)
}
const seedData = () => {
    return apiConfig.client.post(`seed`)
}

export default {
    getMetrics,
    seedData
}