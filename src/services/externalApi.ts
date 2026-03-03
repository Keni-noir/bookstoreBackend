import axios from 'axios';

interface ExternalBook {
    title: string;
    author: string;
    publishYear: Date | null;
}

const API_BASE_URL = "https://openlibrary.org/search.json";

export const ExternalBookSearch = async (query: string) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            params: { q: query },
        })

        const books = response.data.docs.slice(0, 10).map((doc: any) => ({
            title: doc.title,
            author: doc.author_name?.[0],
            publishYear: doc.first_publish_year ?
                new Date(doc.first_publish_year, 0, 1)
                : null
        }))
        return books;

    } catch (error) {
        console.error("External API error:", error);
        throw new Error("Failed to fetch external books");
    }
};