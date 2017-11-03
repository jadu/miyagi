import { AuthenticationUser } from '../interfaces/Authentication';

export default class AuthenticationService {
    private usernameStorageKey: string;
    private user: any;
    private token: string;
    private authenticated: boolean;

    constructor (
        private root: Window
    ) {
        this.authenticated = false;
        this.token = '';
        this.user = null;
        this.usernameStorageKey = 'miyagi:user';
    }

    public init () {
        const storedUsername = this.root.localStorage.getItem(this.usernameStorageKey);

        if (storedUsername && storedUsername.length) {
            this.user = storedUsername;
            this.authenticated = true;
        }
    }

    public authenticate (username) {
        if (username !== null) {
            const formattedUsername = username.split(' ').map(word => {
                return word[0].toUpperCase() + word.slice(1);
            }).join(' ');

            this.root.localStorage.setItem(this.usernameStorageKey, formattedUsername);
            this.user = formattedUsername;
        } else {
            this.user = 'ANONYMOUS';
        }

        this.authenticated = true;
    }

    public getAuthenticatedUser (): AuthenticationUser {
        return {
            authenticated: this.authenticated,
            user: this.user
        }
    }
}
