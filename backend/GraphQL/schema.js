const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # for user
  type User {
    _id: ID!
    username: String!
    role: String!
    bio: String
    profilePicture: String
    socialLinks: SocialLinks
    token: String
  }

  type SocialLinks {
    github: String
    twitter: String
  }

  type Query {
    getUserDetails: User
  }

  type Mutation {
    registerUser(username: String!, password: String!, role: String!): User
    loginUser(username: String!, password: String!): User
    updateUserProfile(username: String, bio: String, profilePicture: String, socialLinks: SocialLinksInput): User
    changePassword(oldPassword: String!, newPassword: String!): String
  }

  input SocialLinksInput {
    github: String
    twitter: String
  }

  # for post
  type Post {
    _id: ID!
    title: String!
    body: String!
    author: User!
    likes: [User!]
    dislikes: [User!]
    createdAt: String!
    updatedAt: String!
    message: String
  }
  

  type Query {
    getPosts(page: Int, limit: Int, searchTerm: String): PaginatedPosts
    getPost(_id: ID!): Post
    getUserPosts(authorId: ID!): [Post!]
  }

  type Mutation {
    createPost(title: String!, body: String!): Post
    updatePost(_id: ID!, title: String, body: String): Post
    deletePost(_id: ID!): String
    likePost(_id: ID!): Post
    dislikePost(_id: ID!): Post
  }

  # For Comment type
  type Comment {
    _id: ID!
    content: String!
    author: User!
    likes: [User]
    dislikes: [User]
    post: Post!
    createdAt: String!
    updatedAt: String!
    message: String
  }

 
  type PaginatedPosts {
    posts: [Post!]
    total: Int
    page: Int
    totalPages: Int
    hasNextPage: Boolean
    hasPrevPage: Boolean
  }

  extend type Query {
    # Existing queries
    getComments(postId: ID!): [Comment!]
    getPosts(page: Int, limit: Int, searchTerm: String): PaginatedPosts
  }

  extend type Mutation {
    # Existing mutations
    createComment(postId: ID!, content: String!): Comment
    updateComment(commentId: ID!, content: String!): Comment
    deleteComment(commentId: ID!): String
    likeComment(commentId: ID!): Comment
    dislikeComment(commentId: ID!): Comment
  }
`;

module.exports = typeDefs;