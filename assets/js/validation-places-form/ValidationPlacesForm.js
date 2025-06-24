export default class ValidationPlacesForm {
    // валидирует инпуты на заполненность
    // возвращает массив не заполненных элементов
    isFilledInputsText(elements = null) {
        if(!elements) {
            console.error('Метод isFilledInputsText ожидает 1 параметр')
            return;
        }
        if(!Array.isArray(elements)) {
            console.error('isFilledInputsText -- Тип данных передаваемого значения должен быть - array')
            return;
        }

        const elNoValid = elements.filter(el => !el.value);

        return elNoValid;
    }

    // возвращает Bool
    validationCheckbox(el) {
        return el.checked;
    }

    // возвращает Bool
    validationRadio(elements = null) {
        if(!elements) {
            console.error('Метод validationRadio ожидает 1 параметр')
            return;
        }
        if(!Array.isArray(elements)) {
            console.error('validationRadio -- Тип данных передаваемого значения должен быть - array')
            return;
        }

        return elements.some(item => item.checked);
    }

    // возвращает Bool
    validationEmail(value) {
        if(value && typeof value !== 'string') {
            console.error('Тип данных передаваемого значения должен быть - string')
            return;
        }
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.+\.[A-Za-z]{2,4}$/i.test(value);
    }
    
    // возвращает Bool
    validationPhone(value) {
        if(value && typeof value !== 'string') {
            console.error('Тип данных передаваемого значения должен быть - string')
            return;
        }

        return /\+7 \(\d\d\d\) \d\d\d-\d\d-\d\d/.test(value);
    }

    // Пароль должен содержать не менее 8 символов.
    // Одна заглавная и одна строчная буква. 
    // Минимум 1 цифра.
    // Наличие символов
    // Возвращает Boolean: false если проверка не пройдена
    validationPassword(value) {
        const allChecks = [];

        if(typeof value === 'string' && value.length > 0) {
            allChecks.push(value.length >= 8);
            allChecks.push(/[A-Z]/.test(value));
            allChecks.push(/[a-z]/.test(value));
            allChecks.push(/\d/.test(value));
            allChecks.push(/[!#$%&?/@*")(]/.test(value));

            return allChecks.every(item => item);
        } else {
            throw new Error('Значение переданное для валидации должно быть строкой');
        }

    }

    // Одинаковы ли введенные пароли
    isSamePasswords(val1, val2) {
        if(val1 && val2) {
            return val1 === val2;
        } else {
            throw new Error('Должно быть передано 2 параметра');
        }
    }
}