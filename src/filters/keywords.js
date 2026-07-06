// Helper function to normalize Arabic letters (ignores typos like أ/ا/إ or ة/ه)
function normalizeArabic(text) {
    if (!text) return "";
    return text
        .toLowerCase()
        .replace(/[أإآ]/g, "ا") // Convert all Alifs to plain ا
        .replace(/ة/g, "ه")     // Convert Teh Marbuta to Heh ه
        .replace(/ى/g, "ي");    // Convert Alef Maksura to Yeh ي
}

export const keywordGroups = {
    // 🌐 Web Development (تطوير المواقع)
    WebDev: {
        'React': 3,
        'رياكت': 3,
        'Next.js': 3,
        'نكست': 3,
        'موقع الكتروني': 2,
        'برمجة موقع': 2,
        'تصميم موقع': 1,
        'ويب': 1,
        'فرونت': 2,
        'Frontend': 2,
        'باك اند': 2,
        'Backend': 2,
        'جافا سكريبت': 2,
        'JavaScript': 2
    },

    // 📱 Mobile Apps (تطبيقات الجوال)
    MobileDev: {
        'تطبيق': 2,
        'اندرويد': 3,
        'Android': 3,
        'ايفون': 3,
        'iOS': 3,
        'فلاتر': 3,
        'Flutter': 3,
        'تطبيقات': 1,
        'جوال': 1
    },

    // 🤖 AI & Python (الذكاء الاصطناعي وبايثون)
    AI_Python: {
        'بايثون': 3,
        'Python': 3,
        'ذكاء اصطناعي': 3,
        'AI': 2,
        'بوت': 2,
        'Bot': 2,
        'شات جي بي تي': 3,
        'ChatGPT': 3
    }
};

export function evaluateProject(title, description) {
    // Normalize both the project text and the search keywords
    const rawText = `${title} ${description}`;
    const cleanText = normalizeArabic(rawText);
    
    let totalScore = 0;
    let matchedKeywords = [];
    let matchedGroup = null;

    for (const [groupName, keywords] of Object.entries(keywordGroups)) {
        let groupScore = 0;
        let currentMatches = [];

        for (const [keyword, score] of Object.entries(keywords)) {
            const cleanKeyword = normalizeArabic(keyword);
            
            if (cleanText.includes(cleanKeyword)) {
                groupScore += score;
                currentMatches.push(keyword); // Keep original keyword for display
            }
        }

        // Keep the group with the highest score
        if (groupScore > totalScore) {
            totalScore = groupScore;
            matchedKeywords = currentMatches;
            matchedGroup = groupName;
        }
    }

    return {
        isMatch: totalScore > 0,
        score: totalScore,
        matchedKeywords,
        matchedGroup
    };
}