const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'cmtr-31f1a922-Events-test';

exports.handler = async (event) => {
   
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

    if (typeof principalId !== 'number' || !content || typeof content !== 'object') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing or invalid 'principalId' or 'content'" }),
        };
    }

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

    try {
        await dynamo.put(params).promise();
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to save event to DynamoDB" }),
        };
    }

    return {
        statusCode: 201,
        body: JSON.stringify({ event: item }),
    };
};