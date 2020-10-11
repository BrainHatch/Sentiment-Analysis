exports.handler = async (event) => {
    try {
        let AWS = require("aws-sdk");

        let comprehend = new AWS.Comprehend();

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
                        /*callback(null, {
                            statusCode: 400,
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            body: JSON.stringify(err)
                        });*/
                        console.log("Error: " + err);
                    }
                    else {
                        /*callback(null, {
                            statusCode: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*"
                            },
                            body: JSON.stringify(data)
                        });*/
                        console.log(JSON.stringify(data));
                        console.log("Sentiment: " + data.Sentiment);
                        console.log("Sentiment Score: " + data.SentimentScore);
                    }
                })
            }
            else {
                console.log(err);
            }

            const response = {
                statusCode: 200,
                body: JSON.stringify('Hello from Lambda!'),
            };
            return response;
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
