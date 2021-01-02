"use strict";

const fetch = require("node-fetch");

let finalResult = [];

/*exports.handler = async (event) => {
  const company = event.company;
  start_api_requests(company);
};*/

//const company = event.company;
const company = "microsoft";
start_api_requests(company);

function start_api_requests(company) {
  const watwe_searchqueries = [
    { sourceType: "water", searchKeyWord: "clean water" },
    { sourceType: "agriculture", searchKeyWord: "agriculture" },
    { sourceType: "transportation", searchKeyWord: "green transportation" },
    { sourceType: "waste", searchKeyWord: "waste management" },
    { sourceType: "energy", searchKeyWord: "renewable energy" },
  ];

  for (let i = 0; i < watwe_searchqueries.length; i++) {
    const sourceType = watwe_searchqueries[i].sourceType;
    const searchKeyWord = watwe_searchqueries[i].searchKeyWord;
    if (sourceType === "water" || sourceType === "energy") {
      Promise.all([
        fetch_custom_google_search(`${company} AND ${searchKeyWord}`),
        fetch_news_api(`${company} AND ${searchKeyWord}`),
      ])
        .then(([custom_google_result, news_api_result]) => {
          add_data_to_array_custom_google_search(
            JSON.parse(custom_google_result),
            sourceType
          );
          add_data_to_array_news_api(JSON.parse(news_api_result), sourceType);
        })
        .then(() => {
          console.log("Length of array: " + finalResult.length);
          console.log(finalResult);
        })
        .catch(() => {
          console.log("There was an error in one of the calls!");
        });
    }
  }
}

async function fetch_custom_google_search(searchQuery) {
  //const key = process.env.custom_google_search_key;
  //const cx = process.env.custom_google_search_cx;

  const key = "AIzaSyBzbHSO7M18yDFDu3xtLjjrCBh4uXO6m1Q";
  const cx = "12c1fd8bac1744505";
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1/?key=${key}&cx=${cx}&q=${searchQuery}`
  );
  const results = await response.json();
  return JSON.stringify(results);
}

function add_data_to_array_custom_google_search(data, sourceType) {
  //console.log("addtoarray: " + data);

  for (let i = 0; i < 3; i++) {
    //TODO: Pass source url to newspaper3k/watson lambda, for now I will use a random number between 1 and 10
    //let source_score = getSourceScore(data.items[i].link);
    let source_score = Math.floor(Math.random() * (1000 - 100) + 100) / 100;

    let thumbnail = "";
    let ogtitle = "";
    let ogdescription = "";
    let updatedat = "";
    if (data.items[i].pagemap.cse_thumbnail) {
      thumbnail = data.items[i].pagemap.cse_thumbnail[0]["src"];
    }
    if (data.items[i].pagemap.metatags) {
      (ogtitle = data.items[i].pagemap.metatags[0]["og:title"]),
        (ogdescription = data.items[i].pagemap.metatags[0]["og:description"]),
        (updatedat = data.items[i].pagemap.metatags[0]["og:updated_time"]);
    }

    const myObj = {
      source: "google_custom_search_api",
      title: data.items[i].title,
      link: data.items[i].link,
      displayLink: data.items[i].displayLink,
      formattedUrl: data.items[i].formattedUrl,
      snippet: data.items[i].snippet,
      og_title: ogtitle,
      og_description: ogdescription,
      thumbnail: thumbnail,
      updated_at: updatedat,
      source_score: source_score,
      source_type: sourceType,
    };

    finalResult.push(myObj);
  }
}

async function fetch_news_api(searchQuery) {
  //const key = process.env.news_api_key;
  const key = "9d414576b1f24aedbceb7e3598c77bfa";
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=popularity&apiKey=${key}`
  );
  const results = await response.json();
  return JSON.stringify(results);
}

function add_data_to_array_news_api(data, sourceType) {
  //for (i = 0; i < data.articles.length; i++)
  for (let i = 0; i < 3; i++) {
    //TODO: Pass URL to Lambda Function with NewsPaper3k
    //let source_text = NEWSPAPER3k(data.items[i].link)
    //TODO: Pass text from newspaper3k to watson, for now I will use a random number between 1 and 10
    //let source_score = ibmWatson(source_text)
    let source_score = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
    const myObj = {
      source: "news_api",
      reference: data.articles[i].source.name,
      author: data.articles[i].author,
      title: data.articles[i].title,
      link: data.articles[i].url,
      description: data.articles[i].description,
      image: data.articles[i].urlToImage,
      publishedAt: data.articles[i].publishedAt,
      content: data.articles[i].content,
      source_score: source_score,
      source_type: sourceType,
    };
    finalResult.push(myObj);
  }
}

function ibmWatson(textToAnalyze) {
  const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
  const { IamAuthenticator } = require("ibm-watson/auth");

  const toneAnalyzer = new ToneAnalyzerV3({
    version: "2017-09-21",
    authenticator: new IamAuthenticator({
      //apikey: process.env.key,
      apikey: "FgnjIcKYPkeOtcR_UwEauHYUwAPlSMbNaNMXsHIcgGQP",
    }),
    //serviceUrl: process.env.url,
    serviceUrl:
      "https://api.us-east.tone-analyzer.watson.cloud.ibm.com/instances/3df85ea5-1dd3-432f-bcf8-f1533415cb45",
  });

  const toneParams = {
    toneInput: { text: textToAnalyze },
    contentType: "application/json",
  };

  console.log(textToAnalyze);
  //console.log(toneParams);
  //console.log(toneAnalyzer);

  const valid_tones_for_score = ["Joy", "Analytical", "Confident"];
  let source_score = 0.0;

  try {
    //console.log("start callllllllllllllllll");
    //console.log("gte the tone: " + toneAnalyzer.tone(toneParams));
    //console.log("here we go!!!");
    toneAnalyzer
      .tone(toneParams)
      .then((toneAnalysis) => {
        //console.log("where are you?: " + toneAnalysis);
        if (toneAnalysis == null) {
          //console.log("toneanalysis is null");
        }

        /*console.log("end call1");
        console.log(JSON.stringify(toneAnalysis, null, 2));
        console.log("end call2");*/
        console.log(
          JSON.stringify(toneAnalysis.result.document_tone.tones, null, 2)
        );

        if (toneAnalysis.result.document_tone.tones != null) {
          let tone_length = toneAnalysis.result.document_tone.tones.length;
          for (let i = 0; i < tone_length; i++) {
            let tone = toneAnalysis.result.document_tone.tones[i];
            if (valid_tones_for_score.includes(tone.tone_name)) {
              console.log(`SCORE ${i}: ${tone.score}`);
              source_score = source_score + tone.score;
            }
          }
        }

        console.log(`SOURCE SCORE IS: ${source_score}`);

        /*const response = {
          statusCode: 200,
          body: JSON.stringify(JSON.stringify(toneAnalysis, null, 2)),
        };*/
        return source_score;
      })
      .catch((err) => {
        console.log("error:", err);
        const response = {
          statusCode: 400,
          body: JSON.stringify(err),
        };
        return response;
      })
      .finally(() => {
        return source_score;
      });
  } catch (err) {
    console.log("This is an error: " + err);
    const response = {
      statusCode: 400,
      body: JSON.stringify("SKIPPED METHOD: " + err),
    };
    return response;
  } finally {
    return source_score;
  }
}

/*function test_ibm() {
  const ibm_text =
    "Team, I know that times are tough! Product " +
    "sales have been disappointing for the past three " +
    "quarters. We have a competitive product, but we " +
    "need to do a better job of selling it!";

  ibmWatson(ibm_text).then((score) => {
    console.log("RETURNED SOURCE SCORE: " + score);
  });
}*/
