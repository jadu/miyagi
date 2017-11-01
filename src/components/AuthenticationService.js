export default class AuthenticationService {
    constructor (root) {
        this.authenticated = false;
        this.token = '';
        this.user = null;
        this.usernameStorageKey = 'miyagi:user';
    }

    init () {
        const storedUsername = root.localStorage.getItem(this.usernameStorageKey);

        if (storedUsername && storedUsername.length) {
            this.user = storedUsername;
            this.authenticated = true;
        }
    }

    authenticate (username) {
        if (username !== null) {
            const formattedUsername = username.split(' ').map(word => {
                return word[0].toUpperCase() + word.slice(1);
            }).join(' ');

            root.localStorage.setItem(this.usernameStorageKey, formattedUsername);
            this.user = formattedUsername;
        } else {
            this.user = 'ANONYMOUS';
        }

        this.authenticated = true;
    }

    getAuthenticatedUser () {
        return {
            authenticated: this.authenticated,
            user: this.user
        }
    }
}
