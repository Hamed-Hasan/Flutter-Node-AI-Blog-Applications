const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    role: String!
    bio: String
    profilePicture: String
    socialLinks: SocialLinks
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
`;

module.exports = typeDefs;
