declare var WordCloud: any; 

// Generates a word cloud
function generateWordCloud(
    posts: Array<{ text: string; user: { age: number; gender: string; region: string } }>,
    filters: { includeKeywords?: string[]; excludeKeywords?: string[]; userAttributes?: { age?: number; gender?: string; region?: string } }) {
    // Filter posts based on the provided filters
    const filteredPosts = posts.filter(post => {
        const { includeKeywords = [], excludeKeywords = [], userAttributes = {} } = filters;

        const includesKeywords = includeKeywords.length === 0 || includeKeywords.some(keyword => (post.text.indexOf(keyword))!== -1);

        const excludesKeywords = excludeKeywords.every(keyword => (post.text.indexOf(keyword) !== -1));

        const matchesAttributes = (() => {
            for (const key in userAttributes) {
                if (userAttributes.hasOwnProperty(key)) {
                    if (post.user[key as keyof typeof post.user] !== userAttributes[key as keyof typeof userAttributes]) {
                        return false;
                    }
                }
            }
            return true;
        })()

        return includesKeywords && excludesKeywords && matchesAttributes;
    });

    // Calculates the word frequencies in the text of filtered posts
    const wordFrequencies: Record<string, number> = {};
    filteredPosts.forEach(post => {
        const words = post.text.split(/\W+/).filter(word => word.length > 0); // Splits text into words
        words.forEach(word => {
            word = word.toLowerCase();
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
        });
    });

    // Convert word frequencies to an array for the word cloud library
    const words: [string, number][] = (() => {
        const entries: [string, number][] = [];
        for (const key in wordFrequencies) {
            if (wordFrequencies.hasOwnProperty(key)) {
                entries.push([key, wordFrequencies[key]]);
            }
        }
        return entries;
    })()

    // Retrieves the canvas element and makes sure it exists
    const canvas = document.getElementById("wordCloudCanvas") as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    // Generates the word cloud
    WordCloud(canvas, {
        list: words,
        gridSize: 12,
        weightFactor: 10,
        fontFamily: "Times, serif",
        color: () => `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        rotateRatio: 0.5,
        rotationSteps: 2,
    });
}

// Test cases
document.addEventListener("DOMContentLoaded", () => {
    // Example function that reads posts 
    function fetchPosts(): Array<{ text: string; user: { age: number; gender: string; region: string } }> {
        return [
            { text: "Learning TypeScript is fun!", user: { age: 25, gender: "female", region: "USA" } },
            { text: "JavaScript is versatile.", user: { age: 30, gender: "male", region: "UK" } },
            { text: "CSS makes everything beautiful.", user: { age: 22, gender: "female", region: "USA" } },
            { text: "React is great for building UIs.", user: { age: 28, gender: "non-binary", region: "Canada" } },
            { text: "Programming in Node.js is efficient.", user: { age: 35, gender: "male", region: "India" } },
        ];
    }

    // Filters "provided by analyst"
    const filters = {
        includeKeywords: ["TypeScript", "React"],
        excludeKeywords: ["CSS"],
        userAttributes: { region: "USA" },
    };

    const posts = fetchPosts();

    // Generate the word cloud without any filters - need to comment out everything below this to test
    generateWordCloud(posts, {});

    // Filter posts based on the analyst's input
    const filteredPosts = posts.filter(post => {
        // Check if the post includes any of the specified keywords
        const includesKeywords = 
            filters.includeKeywords.length === 0 || 
            filters.includeKeywords.some(keyword => post.text.indexOf(keyword) >= 0);

        // Check if the post excludes all specified keywords
        const excludesKeywords = 
            filters.excludeKeywords.every(keyword => post.text.indexOf(keyword) === -1);
    
        // Check if the post's user matches all specified attributes
        const matchesAttributes = (() => {
            for (const key in filters.userAttributes) {
                if (filters.userAttributes.hasOwnProperty(key)) {
                    if (post.user[key as keyof typeof post.user] !== filters.userAttributes[key as keyof typeof filters.userAttributes]) {
                        return false;
                    }
                }
            }
            return true;
        })();

        // The post is included only if it passes all three filters
        return includesKeywords && excludesKeywords && matchesAttributes;
    });
    
    // Generate the word cloud with the filtered posts
    generateWordCloud(filteredPosts, {});
})
