# AuxMe 🎵

AuxMe is an *all-inclusive* music system that allows users to collaborate on song queues democratically. Both the rooms and queues are persisted in a database such that users can re-enter rooms, save queue states and even share room links with their friends. 

## Inspiration
The inspiration for AuxMe comes from the lack of an accessible shared music streaming platform. With the on-going pandemic, people are limited in the ways that they can connect with their peers, friends and family. We wanted to build a highly scalable platform for people to listen to music together on, maintain social interaction and even be exposed to new music.

## Infrastructure
AuxMe is built entirely using the AWS Serverless framework. This allows deploying the entire infrastructure as easy as one command - `serverless deploy`. On top of the ease of deployment, Serverless offers one of the cheapest and most scalable platforms that exists today. Without the overhead of maintaining servers, developers are priviledged with being able to build in the same environment as their production app. This streamlines debugging, since there are no differences between the development and production environments. 

We used AWS Amplify to connect our API to a React Client. This allowed us to call our API endpoints like `API.post('auxme', '/rooms')` without having to worry about ports, restarting a server or configuring a dev environment. Amplify is built to work seamlessly with React; one of the leading front-facing JavaScript development platforms today. This allows maximum performance while allowing us as developers to focus on the platform itself, and not get caught up in configuring an infrastructure. 

AWS Cognito User pools were used for our authentication system, due to their high level of security, Multi-Factor Authentication and ease of configuration. Moreover, this allowed us to easily bootstrap one of the most used and secured Auth systems that exists in the developer eco-system today. 

AWS Cloudfront was used to deliver a highly responsive CDN (Content Delivery Network). In short, API requests will be automatically directed to the closest server to the user, optimizing performance and response times. 

## Technical Details

## What we learned
This project has been an intense, and rewarding learning process for all of us. Here are some of the key takeaways of our learning experience: 
- How to leverage Serverless APIs and REST API best practices
- How to configure AWS Cognito User pools
- Amplify integration with the react client
- Leveraging a serverless websocket API
- Using Context Hooks to inject user authentication throughout the application

## Next Steps 


## Authors
- [Brent Champion](https://github.com/bchampp)
- [Andrew Farley](https://github.com/and1210)
- [Zack Norman](https://github.com/zacknorman)

## License
This project is licensed under the MIT license. See the [License]('./LICENSE.md') file for details. 
