'use strict';

exports.handler = async (event) => {

    try {

        //Gets the text from the AWS Lambda Test Event
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
        magnitude = sentiment.magnitude;

        const sentences = result.sentences;
        sentences.forEach(sentence => {
            sentence_text = sentence.text.content;
            sentence_score = sentence.sentiment.score;
            sentence_magnitude = sentence.sentiment.magnitude;

            var myObj = {
                "api": "google_natural_language",
                "score": score,
                "magnitude": magnitude,
                "sentence_text": sentence_text,
                "sentence_score": sentence_score,
                "sentence_magnitude": sentence_magnitude
            }

            console.log(myObj);
        });

        //Detects the entities of the document
        const [entityAnalysis] = await client.analyzeEntities({ document });

        const entities = entityAnalysis.entities;

        console.log(entities);
        /*entities.forEach(entity => {
            wikipedia_url = ""
            if (entity.metadata && entity.metadata.wikipedia_url) {
                wikipedia_url = entity.metadata.wikipedia_url;
            }

            var myObj = {
                "api": "google_natural_language",
                "entity_name": entity.name,
                "entity_type": entity.type,
                "entity_salience": entity.salience,
                "wikipedia_url": wikipedia_url
            }
            console.log(myObj);
        });*/

        // Need to specify an encodingType to receive word offsets
        const encodingType = 'UTF8';
        // Detects the sentiment of the document
        const [syntax] = await client.analyzeSyntax({ document, encodingType });
        console.log(JSON.stringify(syntax));

        const [aes] = await client.analyzeEntitySentiment({ document });
        const aesentities = aes.entities;
        console.log(JSON.stringify(aesentities));

        const [classification] = await client.classifyText({ document });
        console.log(JSON.stringify(classification));




        const response = {
            statusCode: 200,
            body: JSON.stringify('Successful Sentiment Analysis'),
        };
        return response;
    }
    catch (error) {
        const response = {
            statusCode: 400,
            body: JSON.stringify(error),
        };
        return response;
    }

};

