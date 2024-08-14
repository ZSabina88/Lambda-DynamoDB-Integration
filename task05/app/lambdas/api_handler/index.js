const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'Events';

exports.handler = async (event) => {
    const { principalId, content } = JSON.parse(event.body);
    const id = uuid.v4();
    const createdAt = new Date().toISOString();
    
    const item = {
        id,
        principalId,
        createdAt,
        body: content
    };
    
    const params = {
        TableName: tableName,
        Item: item
    };
    
    await dynamo.put(params).promise();
    
    return {
        statusCode: 201,
        body: JSON.stringify({ event: item }),
    };
};