const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'cmtr-31f1a922-Events-test';

exports.handler = async (event) => {
    const params = {
        TableName: tableName,
        Item: {
            id: uuid.v4(),
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
        await dynamo.put(params).promise();
        return response;
    } catch (err) {
        return JSON.stringify(err, null, 2);
    }
};