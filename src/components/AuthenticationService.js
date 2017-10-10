export default class AuthenticationService {
    constructor () {
        this.authenticated = false;
    }

    setAuthenticated (authenticated) {
        this.authenticated = authenticated;
    }

    getAuthenticated () {
        return this.authenticated;
    }
}
