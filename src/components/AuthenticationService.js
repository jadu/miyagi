export default class AuthenticationService {
    constructor () {
        this.authenticated = false;
        this.token = '';
    }

    authenticateWithParams (params) {
        let token = false;

        if (params && typeof params === 'string') {
            const test = params.match(/code=([A-Za-z\.0-9]+)/i);

            token = test.length ? test[1] : false;
        }

        this.token = token;
    }

    authenticateWithAnnonymous () {
        this.authenticated = true;
    }

    getAuthenticated () {
        return this.authenticated;
    }
}
