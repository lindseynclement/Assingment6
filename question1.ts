// TypeScript Implementation

// Define UserAttributes interface
interface UserAttributes {
  age?: number;
  gender?: string;
  location?: string;
  // Additional attributes as needed
}

// Define User class
class User {
  userName: string;
  attributes: UserAttributes;
  authoredPosts: number[]; // Array of post IDs
  readPosts: Set<number>;  // Set of post IDs
  connections: Map<string, string>; // Map of connection type to userName

  constructor(userName: string, attributes: UserAttributes) {
    this.userName = userName;
    this.attributes = attributes;
    this.authoredPosts = [];
    this.readPosts = new Set();
    this.connections = new Map();
  }
}

// Define Post class
class Post {
  postId: number;
  authorUserName: string;
  content: string;
  creationTimestamp: Date;
  views: Map<string, Date>; // Map of userName to view timestamp
  comments: number[];       // Array of comment IDs

  constructor(postId: number, authorUserName: string, content: string, creationTimestamp: Date) {
    this.postId = postId;
    this.authorUserName = authorUserName;
    this.content = content;
    this.creationTimestamp = creationTimestamp;
    this.views = new Map();
    this.comments = [];
  }
}

// Define Commentmade class (renamed from Comment)
class Commentmade {
  commentId: number;
  authorUserName: string;
  postId: number;
  content: string;
  creationTimestamp: Date;

  constructor(
    commentId: number,
    authorUserName: string,
    postId: number,
    content: string,
    creationTimestamp: Date
  ) {
    this.commentId = commentId;
    this.authorUserName = authorUserName;
    this.postId = postId;
    this.content = content;
    this.creationTimestamp = creationTimestamp;
  }
}

// Maps to store users, posts, and comments
const users = new Map<string, User>();
const posts = new Map<number, Post>();
const comments = new Map<number, Commentmade>();

// Interface for importance scores
interface ImportanceScores {
  [postId: number]: number;
}

// Function to calculate importance scores
function calculateImportanceScores(
  posts: Map<number, Post>,
  alpha: number = 1,
  beta: number = 1
): ImportanceScores {
  const importanceScores: ImportanceScores = {};
  posts.forEach((post, postId) => {
    const numViews = post.views.size;
    const numComments = post.comments.length;
    const score = alpha * numViews + beta * numComments;
    importanceScores[postId] = score;
  });
  return importanceScores;
}

// Function to build the graph representation
function buildGraph(users: Map<string, User>, posts: Map<number, Post>) {
  const nodes: { id: string; label: string; type: string }[] = [];
  const edges: { source: string; target: string; relation: string }[] = [];

  // Add user nodes
  users.forEach((user) => {
    nodes.push({ id: user.userName, label: user.userName, type: 'user' });
  });

  // Add post nodes
  posts.forEach((post) => {
    nodes.push({ id: `post_${post.postId}`, label: `Post ${post.postId}`, type: 'post' });
  });

  // Add edges
  posts.forEach((post) => {
    // Authorship edge
    edges.push({
      source: post.authorUserName,
      target: `post_${post.postId}`,
      relation: 'authored',
    });

    // Viewing edges
    post.views.forEach((_, viewerUserName) => {
      edges.push({
        source: viewerUserName,
        target: `post_${post.postId}`,
        relation: 'viewed',
      });
    });
  });

  return { nodes, edges };
}

// Function to visualize the graph
function visualizeGraph(
  nodes: { id: string; label: string; type: string }[],
  edges: { source: string; target: string; relation: string }[],
  importanceScores: ImportanceScores
) {
  const container = document.getElementById('graph-container');
  if (!container) return;

  // Clear previous content
  container.innerHTML = '';

  // Display nodes
  nodes.forEach((node) => {
    const nodeDiv = document.createElement('div');
    nodeDiv.textContent = node.label;
    nodeDiv.style.border = '1px solid black';
    nodeDiv.style.padding = '5px';
    nodeDiv.style.margin = '5px';
    nodeDiv.style.display = 'inline-block';
    nodeDiv.style.backgroundColor = node.type === 'user' ? 'skyblue' : 'lightgreen';

    // Highlight important posts
    if (node.type === 'post') {
      const postId = parseInt(node.id.split('_')[1]);
      const score = importanceScores[postId] || 0;
      if (score > 0) {
        nodeDiv.style.fontWeight = 'bold';
        nodeDiv.style.backgroundColor = 'yellow';
      }
    }

    container.appendChild(nodeDiv);
  });

  // Display edges
  const edgesDiv = document.createElement('div');
  edgesDiv.textContent = 'Edges:';
  edgesDiv.style.marginTop = '10px';
  container.appendChild(edgesDiv);

  edges.forEach((edge) => {
    const edgeP = document.createElement('p');
    edgeP.textContent = `${edge.source} --[${edge.relation}]--> ${edge.target}`;
    edgesDiv.appendChild(edgeP);
  });
}

// Function to update visualization based on importance criteria
function updateVisualization(alpha: number, beta: number) {
  const importanceScores = calculateImportanceScores(posts, alpha, beta);
  const { nodes, edges } = buildGraph(users, posts);
  visualizeGraph(nodes, edges, importanceScores);
}

// Main function to execute the implementation
function main() {
  // Sample users
  users.set('alice', new User('alice', { age: 25, gender: 'female' }));
  users.set('bob', new User('bob', { age: 30, gender: 'male' }));

  // Sample posts
  const post1 = new Post(101, 'alice', 'Hello World!', new Date('2023-10-01T10:00:00Z'));
  post1.views.set('bob', new Date('2023-10-01T11:00:00Z'));
  posts.set(101, post1);

  const post2 = new Post(102, 'bob', 'Goodbye World!', new Date('2023-10-01T12:00:00Z'));
  post2.views.set('alice', new Date('2023-10-01T13:00:00Z'));
  posts.set(102, post2);

  // Sample comments using Commentmade
  const comment1 = new Commentmade(201, 'bob', 101, 'Nice post!', new Date('2023-10-01T12:00:00Z'));
  comments.set(201, comment1);
  post1.comments.push(comment1.commentId);

  const comment2 = new Commentmade(202, 'alice', 102, 'Thank you!', new Date('2023-10-01T14:00:00Z'));
  comments.set(202, comment2);
  post2.comments.push(comment2.commentId);

  // Initial importance calculation
  const alpha = 1; // Weight for views
  const beta = 1;  // Weight for comments
  updateVisualization(alpha, beta);

  // Example of changing importance criteria
  // Analyst can adjust alpha and beta as needed
}

main();
