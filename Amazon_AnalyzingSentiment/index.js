exports.handler = async (event) => {
    try {
        //Set up AWS and Comprehend
        let AWS = require("aws-sdk");
        let comprehend = new AWS.Comprehend();

        //Gets the text from the AWS Lambda Test Event
        const params = {
            Text: event["text"]
        };

        //Detecting the dominant language of the text
        comprehend.detectDominantLanguage(params, function (err, result) {
            if (!err) {
                const language = result.Languages[0].LanguageCode;

                console.log(language);
                const sentimentParams = {
                    Text: event["text"],
                    LanguageCode: language
                };

                //Analyze the sentiment
                comprehend.detectSentiment(sentimentParams, function (err, data) {
                    if (err) {
                        console.log("Error: " + err);
                    }
                    else {
                        var myObj = {
                            "api": "amazon_comprehend",
                            "score": data.SentimentScore,
                            "sentiment": data.SentimentScore,
                            "sentence_text": event["text"],
                        }
                        console.log(myObj);

                        const response = {
                            statusCode: 200,
                            body: JSON.stringify('Successful Sentiment Analysis'),
                        };
                        return response;
                    }
                })
            }
            else {
                console.log(err);
            }
        });

    }
    catch (error) {
        const response = {
            statusCode: 400,
            body: JSON.stringify(error),
        };
        return response;
    }
};
