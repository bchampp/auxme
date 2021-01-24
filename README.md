# AuxMe 🎵

[![Deployment](https://api.netlify.com/api/v1/badges/1afa5581-6f6e-4c8e-8a7b-c7f5249a02cf/deploy-status)](https://app.netlify.com/sites/auxme/deploys)

AuxMe is an *all-inclusive* music system that allows users to collaborate on song queues in a democratic way. Both the rooms and queues are persisted in a database such that users can re-enter rooms, save queue states and even share room links with their friends. 

## Inspiration
The inspiration for AuxMe comes from the lack of an accessible shared music streaming platform. With the on-going pandemic, people are limited in the ways that they can connect with their peers, friends and family. We wanted to build a highly scalable platform for people to listen to music together on, maintain social interaction and even be exposed to new music.

## Infrastructure
AuxMe is built entirely using the AWS Serverless framework. This allows deploying the entire infrastructure as easy as one command - `serverless deploy`. On top of the ease of deployment, Serverless offers one of the cheapest and most scalable platforms that exists today. Without the overhead of maintaining servers, developers are priviledged with being able to build in the same environment as their production app. This streamlines debugging, since there are no differences between the development and production environments. 

We used AWS Amplify to connect our API to a React Client. This allowed us to call our API endpoints like `API.post('auxme', '/rooms')` without having to worry about ports, restarting a server or configuring a dev environment. Amplify is built to work seamlessly with React; one of the leading front-facing JavaScript development platforms today. This allows maximum performance while allowing us as developers to focus on the platform itself, and not get caught up in configuring an infrastructure. 

AWS Cognito User pools were used for our authentication system, due to their high level of security, Multi-Factor Authentication and ease of configuration. Moreover, this allowed us to easily bootstrap one of the most used and secured Auth systems that exists in the developer eco-system today. 

AWS Cloudfront was used to deliver a highly responsive CDN (Content Delivery Network). In short, API requests will be automatically directed to the closest server to the user, optimizing performance and response times. 

## Technical Details
As mentioned, this project relied on React JS, the Spotify API, as well as AWS Amplify/Lambda for serverless integration. The stack consisted of our front end and a serverless REST API. The REST API was used for any request that needed to interact with the database or deal with user accounts and other associated things. Being run serverless, our development API is built on the exact same platform as the production API. This greatly accelerated our deployment time as there was no server configuration or setup to deal with. Additionally, this meant that all our requests are sent over https rather than the standard development procedure of using http. Using https provides much more security which is very important in production but can also matter in development.

On the frontend, a couple of helper libraries were used in tandem with React JS. The primary of these helper libraries was Material UI to provide us with good looking and easy to implement UI components like buttons, text boxes and images. Material UI is created by Google and is the visual backbone of many projects. We also used AWS Amplify on the frontend for clean and easy communication to our backend. Amplify offers many features including easy access to serverless run backends making it ideal for our stack.

## What we learned
This project has been an intense, and rewarding learning process for all of us. Here are some of the key takeaways of our learning experience: 
- How to leverage Serverless APIs and REST API best practices
- How to configure AWS Cognito User pools
- Amplify integration with the react client
- Leveraging a Serverless websocket API
- Using Context Hooks to inject user authentication throughout the application
- Handling Access and Refresh Tokens

## Next Steps 
Reflecting on this project, there are several next steps that we want to take to further refine the platform, add valuable features and improve the overall robustness of the system. 

- Add additional music streaming services
    - One of the biggest features that we were unable to complete on time was the integration with other music streaming services. Rather than limiting users to spotify, we want to open up the platform to users of any room, and ensure that the playback system works smoothly across all services. 
    - There is a lot of complexity associated with this specific task. For example, we would want to give users the ability to toggle between their streaming services, ensure that the search function worked properly, and most important ensure that the **Shared Queue** still operated properly regardless of the users streaming platform. 
- Add additional social features
    - The nature of this platform is to engage users in a social environment. Currently the only social features that have been built out are the ability to queue songs and vote on them. We would like to build this out further, for example, adding chat rooms, or countdowns for the next song...etc. Anything that can further engage the users in the social atmosphere of the platform. 
- Improve the UI / UX
    - Due to the nature of the hackathon, our primary focus was on building out our *MVP*, which was a functional shared queueing system. As a result, the UI has a lot of room for growth, and there are a lot of user flows that have not been fully explored yet. 
- Implement websockets for the music rooms
    - When we initially started building out the project, we had settled on using a websocket configured through API Gateway to communicate with clients in a room. We believed that this would significantly improve the UX of the platform, allowing users to watch the queue update in real time. Unfortunately, due to the time constraints, we were unable to build out the entire implementation of the websocket, and settled instead for scheduled queue refreshes. The base implementation for the websocket integration can be found in `api/ws`

## Authors
- [Brent Champion](https://github.com/bchampp)
- [Andrew Farley](https://github.com/and1210)
- [Zack Norman](https://github.com/zacknorman)

## Contributing 
We'd love to continue building this platform, and invite other developers to contribute where they'd like to. Please see the [Contributing]('./CONTRIBUTING.md') file for details. 
## License
This project is licensed under the MIT license. See the [License]('./LICENSE') file for details. 
