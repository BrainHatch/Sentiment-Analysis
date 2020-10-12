"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

exports.handler = async (event) => {

    try {
        const key = process.env.textanalytics_key;
        const endpoint = process.env.textanalytics_endpoint;

        const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

        const sentimentInput = [
            {
                text: event["text"],
                id: "0",
                language: "en"
            }
        ];
        const sentimentResult = await client.analyzeSentiment(sentimentInput, { includeOpinionMining: true });

        sentimentResult.forEach(document => {
            console.log(`ID: ${document.id}`);
            console.log(`\tDocument Sentiment: ${document.sentiment}`);
            console.log(`\tDocument Scores:`);
            console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
            console.log(`\tSentences Sentiment(${document.sentences.length}):`);
            document.sentences.forEach(sentence => {
                console.log(`\t\tSentence sentiment: ${sentence.sentiment}`)
                console.log(`\t\tSentences Scores:`);
                console.log(`\t\tPositive: ${sentence.confidenceScores.positive.toFixed(2)} \tNegative: ${sentence.confidenceScores.negative.toFixed(2)} \tNeutral: ${sentence.confidenceScores.neutral.toFixed(2)}`);
                console.log("    Mined opinions");
                for (const { aspect, opinions } of sentence.minedOpinions) {
                    console.log(`      - Aspect text: ${aspect.text}`);
                    console.log(`        Aspect sentiment: ${aspect.sentiment}`);
                    console.log("        Aspect confidence scores:", aspect.confidenceScores);
                    console.log("        Aspect opinions");
                    for (const { text, sentiment } of opinions) {
                        console.log(`        - Text: ${text}`);
                        console.log(`          Sentiment: ${sentiment}`);
                    }
                }
            });
        });

        const entityInputs = [
            event["text"]
        ];
        const entityResults = await client.recognizeEntities(entityInputs);

        entityResults.forEach(document => {
            console.log(`Document ID: ${document.id}`);
            document.entities.forEach(entity => {
                console.log(`\tName: ${entity.text} \tCategory: ${entity.category} \tSubcategory: ${entity.subCategory ? entity.subCategory : "N/A"}`);
                console.log(`\tScore: ${entity.confidenceScore}`);
            });
        });

        const linkedEntityInput = [
            event["text"]
        ];
        const linkedEntityResults = await client.recognizeLinkedEntities(linkedEntityInput);

        linkedEntityResults.forEach(document => {
            console.log(`Document ID: ${document.id}`);
            document.entities.forEach(entity => {
                console.log(`\tName: ${entity.name} \tID: ${entity.dataSourceEntityId} \tURL: ${entity.url} \tData Source: ${entity.dataSource}`);
                console.log(`\tMatches:`)
                entity.matches.forEach(match => {
                    console.log(`\t\tText: ${match.text} \tScore: ${match.confidenceScore.toFixed(2)}`);
                })
            });
        });

        const documents = [
            event["text"]
        ];

        const results = await client.recognizePiiEntities(documents, "en");
        for (const result of results) {
            if (result.error === undefined) {
                console.log("Redacted Text: ", result.redactedText);
                console.log(" -- Recognized PII entities for input", result.id, "--");
                for (const entity of result.entities) {
                    console.log(entity.text, ":", entity.category, "(Score:", entity.confidenceScore, ")");
                }
            } else {
                console.error("Encountered an error:", result.error);
            }
        }

        const keyPhrasesInput = [
            event["text"]
        ];
        const keyPhraseResult = await client.extractKeyPhrases(keyPhrasesInput);

        keyPhraseResult.forEach(document => {
            console.log(`ID: ${document.id}`);
            console.log(`\tDocument Key Phrases: ${document.keyPhrases}`);
        });

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
