"use strict";

const fetch = require("node-fetch");

let finalResult = [];

start_api_requests_test();

function start_api_requests_test() {
  const company = "google";
  let promiseMe = getMyPromise(company);
  console.log("Promise Me" + promiseMe.then((data) => data));
}

function getMyPromise(company) {
  return google_promise(`${company} AND clean water`, "water").then(function (
    result
  ) {
    result;
    console.log(result);
  });
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.resolve(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

async function google_promise(searchQuery, sourceType) {
  //const key = process.env.custom_google_search_key;
  //const cx = process.env.custom_google_search_cx;

  const key = "AIzaSyBzbHSO7M18yDFDu3xtLjjrCBh4uXO6m1Q";
  const cx = "12c1fd8bac1744505";

  const request = await fetch(
    `https://www.googleapis.com/customsearch/v1/?key=${key}&cx=${cx}&q=${searchQuery}`
  )
    .then(status)
    .then(json);
  return Promise.resolve(request);
}

function custom_google_search_api_test(searchQuery, sourceType) {
  //const key = process.env.custom_google_search_key;
  //const cx = process.env.custom_google_search_cx;

  const key = "AIzaSyBzbHSO7M18yDFDu3xtLjjrCBh4uXO6m1Q";
  const cx = "12c1fd8bac1744505";

  fetch(
    `https://www.googleapis.com/customsearch/v1/?key=${key}&cx=${cx}&q=${searchQuery}`
  )
    .then(status)
    .then(json)
    .then(function (data) {
      //console.log("Request succeeded with JSON response", data);
      console.log("Request succeeded with JSON response");
      for (let i = 0; i < 1; i++) {
        //TODO: Pass URL to Lambda Function with NewsPaper3k
        //let source_text = NEWSPAPER3k(data.items[i].link)

        //TODO: Pass text from newspaper3k to watson, for now I will use a random number between 1 and 10
        //let source_score = ibmWatson(source_text)
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
            (ogdescription =
              data.items[i].pagemap.metatags[0]["og:description"]),
            (updatedat = data.items[i].pagemap.metatags[0].updated_at);
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
      console.log("Im here");
      //return finalResult;
      return Promise.resolve(finalResult);
    })
    .catch(function (error) {
      console.log("Request failed", error);
    });
}
