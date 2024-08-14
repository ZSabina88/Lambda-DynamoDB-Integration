const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'Events';


exports.handler = async (event) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Request body is missing" }),
        };
    }

    let parsedBody;
    try {
        parsedBody = JSON.parse(event.body);
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON in request body" }),
        };
    }

    const { principalId, content } = parsedBody;
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