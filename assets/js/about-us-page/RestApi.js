export default class Rest {
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
            const data = response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }

    async read() {
        try {
            const response = await fetch(`${this.paths.read}`);
            const data = response.json();
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
            const data = response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }

    async delete() {
        try {
            const response = await fetch(`${this.path.delete}`);
            const data = response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }
}