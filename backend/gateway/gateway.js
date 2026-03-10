import axios from "axios";

class Gateway {
    constructor() {
        this.create = axios.create({ baseURL: 'http://localhost:8081/v1' });
        this.update = axios.create({ baseURL: 'http://localhost:8082/v1' });
        this.read = axios.create({ baseURL: 'http://localhost:8083/v1' });
    }

    async createScore(request) {
        const response = await this.create.post('/createScore', request);
        return response.data;
    }

    async updateScore(request) {
        const response = await this.update.put('/updateScore', request);
        return response.data;
    }

    async patchUpdateScore(request) {
        const response = await this.update.patch('/patchUpdateScore', request);
        return response.data;
    }

    async getScore(request) {
        const response = await this.read.get('/getScore', request);
        return response.data;
    }
}

export default new Gateway();