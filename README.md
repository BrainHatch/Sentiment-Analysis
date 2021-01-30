# Sentiment-Analysis
Compare Sentiment Analysis for GCP, AWS, and Azure hosted in AWS Lambda

For GCP you need to create a service account with a role of owner and download the json file. Rename to json to setup.json and add to the root of the project. Link is below.

https://cloud.google.com/natural-language/docs/setup

<strong>Node</strong>

Google npm install --save @google-cloud/language

AWS npm install aws-sdk

Microsoft npm install --save @azure/ai-text-analytics@5.1.0-beta.1

IBM npm install ibm-watson@^5.7.0

<strong>Python</strong>

IBM pip install --upgrade "ibm-watson>=4.6.0"
