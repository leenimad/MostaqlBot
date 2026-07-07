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
    // 🌐 Web Development & Software Engineering (برمجة وتطوير المواقع والأنظمة)
    WebDev: {
        // --- Your Custom Arabic Keywords ---
        'موقع': 1,
        'مصمم': 1,
        'مطور': 2,
        'مطور فل ستاك': 4,
        'Full Stack': 4,
        'Full-Stack': 4,
        'مبرمج': 2,
        'تصميم': 1,
        'برمجة': 2,
        'تطوير': 1,
        'صفحات': 1,
        'الكتروني': 1,
        'الكترونية': 1,
        'منصة': 2,

        // --- Mostaql-Specific Arabic Suggestions ---
        'متجر الكتروني': 3,     // E-commerce store (Very common!)
        'لوحة تحكم': 3,        // Dashboard / Admin Panel (Very common!)
        'صفحة هبوط': 2,        // Landing Page
        'لاندينج': 2,          // Landing Page (transliterated)
        'واجهات': 2,           // Frontend / UI
        'تطبيق ويب': 3,        // Web Application
        'قاعدة بيانات': 2,     // Database
        'ربط': 2,              // Integration / Connecting APIs
        'بوابة دفع': 3,        // Payment Gateway (Stripe/PayPal)

        // --- Technical Stacks (Bilingual) ---
        'React': 3,
        'رياكت': 3,
        'Next.js': 3,
        'نكست': 3,
        'Node.js': 3,
        'نود': 3,
        'Express.js': 3,    
        'إكسبريس': 3,
        'typeScript': 2,
        'تايب سكريبت': 2,
        'javascript': 2,
        'جافا سكريبت': 2,
        'mongoDB': 3,
        'مونغو': 3,
        'MySQL': 3,

    },

    // 📱 Mobile Apps Development (برمجة تطبيقات الجوال)
    MobileDev: {
        'تطبيق': 2,
        'تطبيقات': 1,
        'جوال': 1,
        'اندرويد': 3,
        'Android': 3,
        'ايفون': 3,
        'iOS': 3,
        'فلاتر': 3,
        'Flutter': 3,
        
    },

    // 🤖 Artificial Intelligence & Automation (الذكاء الاصطناعي والأتمتة)
    AI_Automation: {
        'بايثون': 3,
        'Python': 3,
        'ذكاء اصطناعي': 3,
        'AI': 2,
        'بوت': 2,
        'Bot': 2,
        'شات جي بي تي': 3,
        'ChatGPT': 3,
        'تلقائي': 1,
        'اوتوماتيك': 2
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