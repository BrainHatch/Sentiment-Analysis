'use strict';

exports.handler = async (event) => {

    try {

        const text = event["text"];

        //Imports the Google Cloud client library
        const language = require('@google-cloud/language');

        //Creates a client
        const client = new language.LanguageServiceClient();

        //Prepares a document, representing the provided text
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        //Detects the sentiment of the document
        const [result] = await client.analyzeSentiment({ document });

        const sentiment = result.documentSentiment;
        var score = "", magnitude = "", sentence_text = "", sentence_score = "", sentence_magnitude = "";

        score = sentiment.score;
        console.log(`Score: ${sentiment.score}`);
        magnitude = sentiment.magnitude;
        console.log(`Magnitude: ${sentiment.magnitude}`);

        const sentences = result.sentences;
        sentences.forEach(sentence => {
            console.log(`Sentence: ${sentence.text.content}`);
            console.log(`Score: ${sentence.sentiment.score}`);
            console.log(`Magnitude: ${sentence.sentiment.magnitude}`);
            sentence_text = sentence.text.content;
            sentence_score = sentence.sentiment.score;
            sentence_magnitude = sentence.sentiment.magnitude;
        });

        var myObj = {
            "score": score,
            "magnitude": magnitude,
            "sentence_text": sentence_text,
            "sentence_score": sentence_score,
            "sentence_magnitude": sentence_magnitude
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(myObj),
        };
        return response;
    }
    catch (error) {
        const response = {
            statusCode: 400,
            body: JSON.stringify('Error: ' + error),
        };
        return response;
    }

};

