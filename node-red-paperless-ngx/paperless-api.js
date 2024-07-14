

module.exports = class PaperlessNgxApi {
    constructor(baseurl, apiAuthToken) {
        this._baseUrl = baseurl;
        this._authToken = apiAuthToken;
    }

    static create(hostname, port, apiKey, tls = true) {
        const protocol = tls === true ? "https" : "http";
        const baseurl = protocol + "://" + hostname + ':' + port;

        return new this(baseurl, apiKey)
    }

    async request(method, endpoint, params, data = undefined) {
        let url = `${this._baseUrl}${endpoint}`
        if (params) {
            url += `?${params}`
        }

        const request = {
            method: method,
            credentials: 'include',
            headers: {
                Authorization: 'Token ' + this._authToken,
                Accept: 'application/json',
            },
        }
        if (data) {
            request.headers = {
                ...request.headers,
                'Content-Type': 'application/json'
            }
            request.body = JSON.stringify(data)
        }

        const response = await fetch(url, request)

        const result = await response.json()
        return result?.results
    }

    async getDocuments(query) {
        const params = new URLSearchParams({
            query: query,
            page_size: 100000
        })
        return await this.request('GET', '/api/documents/', params)
    }

    async getTags() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/tags/', params)
    }

    async getCorrespondents() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/correspondents/', params)
    }

    async getDocTypes() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/document_types/', params)
    }

    async getCustomFields() {
        const params = new URLSearchParams({
            page_size: 100000
        })
        return await this.request('GET', '/api/custom_fields/', params)
    }

    async updateDocument(documentId, data) {
        const url = `/api/documents/${documentId}/`
        console.log("updating", url)
        return await this.request('PATCH', url, undefined, data)
    }

}