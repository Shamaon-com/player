/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      emailVerify
      surname
      job
      location
      city
      isMedic
      lastSeen
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        emailVerify
        surname
        job
        location
        city
        isMedic
        lastSeen
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAnalytic = /* GraphQL */ `
  query GetAnalytic($id: ID!) {
    getAnalytic(id: $id) {
      id
      projectId
      userId
      deviceType
      location
      pageUrl
      eventType
      eventValue
      createdAt
      updatedAt
    }
  }
`;
export const listAnalytics = /* GraphQL */ `
  query ListAnalytics(
    $filter: ModelAnalyticFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        projectId
        userId
        deviceType
        location
        pageUrl
        eventType
        eventValue
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      projectId
      email
      question
      createdAt
      updatedAt
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        projectId
        email
        question
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      projectId
      email
      message
      createdAt
      updatedAt
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        projectId
        email
        message
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getByEmail = /* GraphQL */ `
  query GetByEmail(
    $email: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        email
        emailVerify
        surname
        job
        location
        city
        isMedic
        lastSeen
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getByProjectIdAnalytic = /* GraphQL */ `
  query GetByProjectIdAnalytic(
    $projectId: String
    $sortDirection: ModelSortDirection
    $filter: ModelAnalyticFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByProjectIdAnalytic(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        projectId
        userId
        deviceType
        location
        pageUrl
        eventType
        eventValue
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getByUserIdAnalytic = /* GraphQL */ `
  query GetByUserIdAnalytic(
    $userId: String
    $sortDirection: ModelSortDirection
    $filter: ModelAnalyticFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByUserIdAnalytic(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        projectId
        userId
        deviceType
        location
        pageUrl
        eventType
        eventValue
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getByProjectIdQuestion = /* GraphQL */ `
  query GetByProjectIdQuestion(
    $projectId: String
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByProjectIdQuestion(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        projectId
        email
        question
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getByProjectIdMessage = /* GraphQL */ `
  query GetByProjectIdMessage(
    $projectId: String
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByProjectIdMessage(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        projectId
        email
        message
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
