import QuestionProvider from '../providers/QuestionProvider';
import ListService from '../services/ListService';

export class QuestionProviderFactory {
    /**
     * Create QuestionProvider instance
     */
    public static create (): QuestionProvider {
        return new QuestionProvider(
            new ListService()
        );
    }
}
