export default class AuthenticationService {
    constructor () {
        this.authenticated = false;
        this.token = '';
        this.user = null;
    }

    authenticateWithParams (params) {
        let token = false;

        if (params && typeof params === 'string') {
            const test = params.match(/code=([A-Za-z\.0-9]+)/i);

            token = test.length ? test[1] : false;
        }

        this.token = token;
    }

    authenticate (username) {
        this.authenticated = true;
        this.user = username !== null ? username : 'ANONYMOUS';
    }

    authenticateWithAnnonymous () {
        this.authenticated = true;
    }

    getAuthenticatedUser () {
        return {
            authenticated: this.authenticated,
            user: this.user
        }
    }
}
