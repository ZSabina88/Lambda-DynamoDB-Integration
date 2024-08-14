const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "cmtr-31f1a922-Events-test";


exports.handler = async (event) => {
    const { principalId, content } = JSON.parse(event.body);
    const id = uuidv4();
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
        await docClient.put(params).promise();
        return {
            statusCode: 201,
            event: params.Item,
        };;
    } catch (err) {
        return JSON.stringify(err, null, 2);
    }

};