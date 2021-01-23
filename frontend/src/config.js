const config = {
    s3: {
      REGION: "ca-central-1",
      BUCKET: "auxme-uploads",
    },
    apiGateway: {
        REGION: "ca-central-1",
        URL: "https://xicyp8tt7h.execute-api.ca-central-1.amazonaws.com/dev"
    },
    cognito: {
      REGION: "ca-central-1",
      USER_POOL_ID: "ca-central-1_GTccCETrZ",
      APP_CLIENT_ID: "5frtrtk81nc31lonmrnmqsr9l1",
      IDENTITY_POOL_ID: "ca-central-1:006572f4-6a43-4c94-8d9c-7515c3abcf61",
    },
  };
  
  export default config;