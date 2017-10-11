export default class AuthenticationService {
    constructor () {
        this.authenticated = false;
    }

    authenticateWithParams (params) {
        let authenticated = false;

        if (params && typeof params === 'string') {
            const test = params.match(/code=([A-Za-z\.0-9]+)/i);

            authenticated = test.length ? test[1] : false;
        }

        this.authenticated = authenticated;
    }

    authenticateWithAnnonymous () {
        this.authenticated = 'annonymous';
    }

    getAuthenticated () {
        return this.authenticated;
    }
}
