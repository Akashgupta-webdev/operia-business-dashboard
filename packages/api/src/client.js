import axios from "axios";

export function createApiClient(config) {
    return axios.create(config);
}
