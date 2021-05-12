const getEventSource = async (topicsArray) => {
  const url = new URL(process.env.REACT_APP_MERCURE_HUB_URL);

  topicsArray.forEach(topic => {
    url.searchParams.append("topic", topic);
  });

  console.log("hub url with topics", url);

  if (process.env.NODE_ENV === "production") {
    // PRODUCTION with authorization
    const newEventSource = await fetch("https://mercure-demo.druid.fi/demo/books/1.jsonld", { credentials: "include" })
      .then(response => {
        console.log("response", response);
        console.log("Link header", response.headers.get("Link"));
        // Extract the hub URL from the Link header
        //const hubUrl = response.headers.get("Link").match(/<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/)[1];
          
        return new EventSource(url.toString(), { withCredentials: true });
      });
    return newEventSource;
  } else {
    // LOCAL without authorization
    return new EventSource(url.toString());
  }
};

export default getEventSource;