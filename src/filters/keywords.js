export const keywordGroups = {
    Frontend: { 'React': 3, 'Next.js': 3, 'Frontend': 1, 'JavaScript': 1 },
    Backend: { 'Node.js': 3, 'Express': 2, 'API': 1, 'MongoDB': 2, 'Backend': 1 },
    Mobile: { 'Flutter': 3, 'React Native': 3, 'iOS': 2, 'Android': 2 },
    FullStack: { 'Full Stack': 4, 'Full-Stack': 4, 'Web Application': 2 }
};

export function evaluateProject(title, description) {
    const textToSearch = `${title} ${description}`.toLowerCase();
    let totalScore = 0;
    let matchedKeywords = [];
    let matchedGroup = null;

    for (const [groupName, keywords] of Object.entries(keywordGroups)) {
        let groupScore = 0;
        let currentMatches = [];

        for (const [keyword, score] of Object.entries(keywords)) {
            if (textToSearch.includes(keyword.toLowerCase())) {
                groupScore += score;
                currentMatches.push(keyword);
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