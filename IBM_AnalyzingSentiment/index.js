"use strict";
exports.handler = async (event) => {
    IBM();
};

IBM();

function IBM(){
    const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const toneAnalyzer = new ToneAnalyzerV3({
        version: '2017-09-21',
        authenticator: new IamAuthenticator({
            apikey: process.env.key,
        }),
        serviceUrl: process.env.url,
        //disableSslVerification: true,

    });

    const text = 'Team, I know that times are tough! Product '
        + 'sales have been disappointing for the past three '
        + 'quarters. We have a competitive product, but we '
        + 'need to do a better job of selling it!';

    const toneParams = {
        toneInput: { 'text': 'This is my test!!!!' },
        contentType: 'application/json',
    };

    console.log(text);
    console.log(toneParams);
    //console.log(toneAnalyzer);

    try {
        console.log("start callllllllllllllllll");
        console.log("gte the tone: " + toneAnalyzer.tone(toneParams));
        console.log("here we go!!!");
        toneAnalyzer.tone(toneParams)
            .then(toneAnalysis => {
                console.log("where are you?: " + toneAnalysis);
                if(toneAnalysis == null){
                    console.log("toneanalysis is null");
                }

                console.log("end call1");
                console.log(JSON.stringify(toneAnalysis, null, 2));
                console.log("end call2");
                /*console.log(JSON.stringify(toneAnalysis, null, 2));
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(JSON.stringify(toneAnalysis, null, 2)),
                };
                return response;*/
            })
            .catch(err => {
                console.log('error:', err);
                const response = {
                    statusCode: 400,
                    body: JSON.stringify(err),
                };
                return response;
            })
            .finally(err => {
                console.log("finally" + err);
            });
    }
    catch (err) {
        console.log("This is an error: " + err);
        const response = {
            statusCode: 400,
            body: JSON.stringify("SKIPPED METHOD: " + err),
        };
        return response;
    }
}