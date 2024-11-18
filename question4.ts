type Post = {
    id: string;
    content: string;
    userId: string;
    views: Array<{ userId: string; timestamp: Date }>;
    comments: string[];
};

type User = {
    id: string;
    name: string;
    age: number;
    gender: string;
    region: string;
    posts: Post[];
    connections: Set<string>;
};

// Function to get the user by ID
function getUserById(userId: string): User | undefined {
    return users.find(user => user.id === userId);
}

function calculateTrendingRate(post: Post, timeWindowMinutes: number): number {
    const now = new Date();
    // View count in x time
    const viewsInWindow = post.views.filter(view => {
        const diffInMinutes = (now.getTime() - new Date(view.timestamp).getTime()) / (1000 * 60);
        // Calculate rate of views
        return diffInMinutes <= timeWindowMinutes;
    });

    return viewsInWindow.length / timeWindowMinutes;
}

function getTrendingPosts(posts: Post[], timeWindowMinutes: number): Post[] {
    // Calculate trending rates
    const postsWithRate = posts.map(post => ({
        post,
        trendingRate: calculateTrendingRate(post, timeWindowMinutes),
    }));
    // Sort posts by trending rate
    postsWithRate.sort((a, b) => b.trendingRate - a.trendingRate);
    // Returns sorted posts
    return postsWithRate.map(postWithRate => postWithRate.post);
}
// Filters posts based on explicit keywords
function filterPosts(posts: Post[], filters: { includeKeywords?: string[]; excludeKeywords?: string[]; userAttributes?: any }): Post[] {
    return posts.filter(post => {
        const includesKeywords = filters.includeKeywords ? filters.includeKeywords.every(keyword => post.content.includes(keyword)) : true;
        const excludesKeywords = filters.excludeKeywords ? filters.excludeKeywords.every(keyword => !post.content.includes(keyword)) : true;

        // Check attributes
        const matchesUserAttributes = filters.userAttributes
            ? Object.keys(filters.userAttributes).every(key => {
                const user = getUserById(post.userId);
                if (user) {
                    return user[key as keyof typeof user] === filters.userAttributes[key as keyof typeof filters.userAttributes];
                }
                return false;
            })
            : true;

        return includesKeywords && excludesKeywords && matchesUserAttributes;
    });
}

function getTopTrendingPosts(posts: Post[], filters: any, timeWindowMinutes: number): Post[] {
    // Filter all posts
    const filteredPosts = filterPosts(posts, filters);
    // Identify trending posts, and sorts them
    const trendingPosts = getTrendingPosts(filteredPosts, timeWindowMinutes);
    // Return top 10 trending posts
    return trendingPosts.slice(0, 10);
}

// Post test cases
const posts: Post[] = [
  {
    id: "1",
    content: "どうも！最近時間が取れずで、久しぶりのポストですｗ ノーマルバトルは土曜日の夜中にスコアMAX取ってましたが、動画撮影と編集する時間がなくて休日過ぎてしまいました💦",
    userId: "1",
    views: [{ userId: "1", timestamp: new Date() }],
    comments: []
  },
  {
    id: "2",
    content: "「魔国武勇祭～妖瞳血姫～ノーマルバトル上級①②③ スコアMAX参考動画！」",
    userId: "1",
    views: [{ userId: "2", timestamp: new Date() }],
    comments: []
  },
  {
    id: "3",
    content: "広島ありがとうございました唯一無二なライブを感じてもらえたはず皆の気合いも伝わってきたよ",
    userId: "2",
    views: [{ userId: "3", timestamp: new Date() }],
    comments: []
  },
  {
    id: "4",
    content: "11月16日(土)〜17日(日) ΛrlequiΩ FCツアー「アバタモエクボ in なっちょだい長野」ビュッフェや花火、ビンゴ大会などFCツアーならではの催しを詰め込んだ2日間。たくさんのご参加ありがとうございました！",
    userId: "3",
    views: [{ userId: "4", timestamp: new Date() }],
    comments: []
  },
  {
    id: "5",
    content: "2024.11.15∔ホテル椿山荘 Moi-même-Moitié Official TeaParty ～胡蝶の夢見る庭､青薔薇の誓い～ Moi-même-Moitié様 25周年おめでとうございます🦋",
    userId: "4",
    views: [{ userId: "5", timestamp: new Date() }],
    comments: []
  },
  {
    id: "6",
    content: "今日は高知まで行ってザアザアさんのライブを見に行きました。すごくかっこよかったです。特にボーカルの人が",
    userId: "5",
    views: [{ userId: "6", timestamp: new Date() }],
    comments: []
  },
  {
    id: "7",
    content: "これすごいな",
    userId: "6",
    views: [{ userId: "7", timestamp: new Date() }],
    comments: []
  },
  {
    id: "8",
    content: "トリミング中にご主人を見つけたワンコの反応が可愛すぎる",
    userId: "7",
    views: [{ userId: "8", timestamp: new Date() }],
    comments: []
  }
];

// Users test cases
const users: User[] = [
  { 
    id: "1", 
    name: "しみざわ@嵐@YT_shimizawa_ch", 
    age: 28, 
    gender: "Male", 
    region: "Tokyo", 
    posts: [posts[0], posts[1]], 
    connections: new Set(["2", "3"])
  },
  { 
    id: "2", 
    name: "ゼラ 氷翠@zera_hisui", 
    age: 26, 
    gender: "Male", 
    region: "Hiroshima", 
    posts: [posts[2]], 
    connections: new Set(["1", "3"])
  },
  { 
    id: "3", 
    name: "ΛrlequiΩ -アルルカン- official@Arlequin_offi", 
    age: 30, 
    gender: "Male", 
    region: "Nagoya", 
    posts: [posts[3]], 
    connections: new Set(["1", "2"])
  },
  { 
    id: "4", 
    name: "DazzlingBAD - i T -@xxxBAD_iT_", 
    age: 29, 
    gender: "Male", 
    region: "Osaka", 
    posts: [posts[4]], 
    connections: new Set(["1", "5"])
  },
  { 
    id: "5", 
    name: "ザアザア 一葵@oChbQyEHv8j9XCN", 
    age: 27, 
    gender: "Male", 
    region: "Kochi", 
    posts: [posts[5]], 
    connections: new Set(["4", "6"])
  },
  { 
    id: "6", 
    name: "葉月/HAZUKI@hazuki_lynch", 
    age: 25, 
    gender: "Female", 
    region: "Tokyo", 
    posts: [posts[6]], 
    connections: new Set(["7"])
  },
  { 
    id: "7", 
    name: "犬のかわいさ伝え隊@VvPgPjCRM822053", 
    age: 26, 
    gender: "Female", 
    region: "Sapporo", 
    posts: [posts[7]], 
    connections: new Set(["6"])
  }
];

// Filters posts by keywords
const filterPostsByKeywords = (posts: Post[], includeKeywords: string[], excludeKeywords: string[]) => {
  return posts.filter(post => {
    const includesKeywords = includeKeywords.every(keyword => post.content.includes(keyword));
    const excludesKeywords = excludeKeywords.every(keyword => !post.content.includes(keyword));
    return includesKeywords && excludesKeywords;
  });
};

// Filters by region
const filterByRegion = (users: User[], region: string) => {
  return users.filter(user => user.region === region);
};

// Filters by gender
const filterByGender = (users: User[], gender: string) => {
  return users.filter(user => user.gender === gender);
};

// Filters by age
const filterByAge = (users: User[], minAge: number) => {
  return users.filter(user => user.age > minAge);
};

// Test 1: Filter by Keywords (Include "ライブ", Exclude "動画")
const postsWithKeywords = users
  .map(user => ({
    user,
    posts: filterPostsByKeywords(user.posts, ["ライブ", "ツアー", "チケット", "アルバム"], ["動画", "購入", "登録", "アンケート"]),
  }))
  .filter(userPosts => userPosts.posts.length > 0);

console.log("Keyword Filter: (Include 'ライブ', 'ツアー', 'チケット', 'アルバム'; Exclude '動画', '購入', '登録', 'アンケート'):");
console.log(postsWithKeywords);

// Test 2: Filter by Region (Sapporo)
const usersInSapporo = filterByRegion(users, "Sapporo");
console.log("Region Filter (Sapporo):");
console.log(usersInSapporo);

// Test 3: Filter by Gender (Female)
const genderedUsers = filterByGender(users, "Female");
console.log("Gender Filter (Female):");
console.log(genderedUsers);

// Test 4: Filter by Age (Above 27)
const usersAbove27 = filterByAge(users, 27);
console.log("Age Filter (Above 27):");
console.log(usersAbove27);

const trendingPosts = getTrendingPosts(posts, 30);
console.log("Trending Post (last 30m):");
console.log(trendingPosts);

// Test 5: Filter by Keywords AND User Attributes
const postsWithKeywordsAndAttributes = users
  .map(user => ({
    user,
    posts: filterPosts(user.posts, {
      includeKeywords: [], // Include Keywords
      excludeKeywords: ["購入", "登録", "アンケート"], // Exclude Keywords
      userAttributes: { age: 28, region: "Tokyo", gender: "Male" }, // User Filters
    }),
  }))
  .filter(userPosts => userPosts.posts.length > 0);

console.log("Keyword and User Attributes Filter (Age 28, Region Tokyo, Male):");
console.log(postsWithKeywordsAndAttributes);
