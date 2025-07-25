export default class RequestApi {
    constructor(paths) {
        this.paths = paths;
        
    }

    // Старт страницы
    async readStart() {
        try {
            const response = await fetch(`${this.paths.read}`);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }

    // Конкретный заказ получить данные
    async readOrder(id) {
        try {
            const response = await fetch(`${this.paths.read}`);
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('');
        }
    }

    // Дооформление заказа, отправка данных заказчика, туристов, и соглашения
    async createOrderData(data) {
        return new Promise((res, rej) => setTimeout(() => res(true), 2000));
        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: data,
            })

            const result = response.json();
            return result;
        } catch (error) {
            throw new Error('Ошибка отправки данных для оформления заказа. Текст ошибки: \n', error);
        }
    }

    // Запрос на изменение заказа
    async createOrderChange(data) {
        return new Promise((res, rej) => setTimeout(() => res(true), 2000));
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

    // Запрос на аннуляцию заказа
    async createOrderAnnulation(data) {
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

    // Задать вопрос
    async createQuestion(data) {
        return new Promise((res, rej) => setTimeout(() => res(true), 2000));
        try {
            const response = await fetch(`${this.paths.create}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'multipart/form-data',
                },
                body: data,
            });
            const result = await response.json();
            return result;
        } catch (error) {
            throw new Error('');
        }
    }


    async createEmail(data) {
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