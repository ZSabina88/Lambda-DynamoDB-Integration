const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "Events";

exports.handler = async (event) => {
  const params = {
    TableName: tableName,
    Item: {
      id: uuidv4(),
      principalId: event.principalId,
      createdAt: new Date().toISOString(),
      body: event.content,
    },
  };
  const response = {
    statusCode: 201,
    event: params.Item,
  };
  try {
    await docClient.put(params).promise();
    return response;
  } catch (err) {
    return JSON.stringify(err, null, 2);
  }
};