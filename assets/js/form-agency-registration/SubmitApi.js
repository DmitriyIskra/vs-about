export default class SubmitApi {
    constructor(paths) {
        this.paths = paths;
        
    }

    async create(data) {
        return new Promise( resolve => {
                setTimeout(() => {
                    return resolve(true)
                }, 3500);
        } );
        try {
            const response = await fetch(`${this.paths.create}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'multipart/form-data',
                },
                body: data,
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Данные не переданы: ----', error);
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
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }

    async delete() {
        try {
            const response = await fetch(`${this.path.delete}`);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }
}