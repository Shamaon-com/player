/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createAnalytic = /* GraphQL */ `
  mutation CreateAnalytic(
    $input: CreateAnalyticInput!
    $condition: ModelAnalyticConditionInput
  ) {
    createAnalytic(input: $input, condition: $condition) {
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
export const updateAnalytic = /* GraphQL */ `
  mutation UpdateAnalytic(
    $input: UpdateAnalyticInput!
    $condition: ModelAnalyticConditionInput
  ) {
    updateAnalytic(input: $input, condition: $condition) {
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
export const deleteAnalytic = /* GraphQL */ `
  mutation DeleteAnalytic(
    $input: DeleteAnalyticInput!
    $condition: ModelAnalyticConditionInput
  ) {
    deleteAnalytic(input: $input, condition: $condition) {
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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      projectId
      email
      question
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
      id
      projectId
      email
      question
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
      id
      projectId
      email
      question
      createdAt
      updatedAt
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      projectId
      email
      message
      createdAt
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      projectId
      email
      message
      createdAt
      updatedAt
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      projectId
      email
      message
      createdAt
      updatedAt
    }
  }
`;
