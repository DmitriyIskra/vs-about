export default class myJourneysApi {
    constructor(paths) {
        this.paths = paths;
        
    }

    async create(data) {
        try {
            const response = await fetch(`${this.paths.create}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : '',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error('');
        }
    }

    async read() {
        try {
            const response = await fetch(`${this.paths.read}`);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }

    async update(data) {
        try {
            const response = await fetch(`${this.paths.update}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : '',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error('');
        }
    }

    async delete() {
        try {
            const response = await fetch(`${this.path.delete}`);
            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error('');
        }
    }
}