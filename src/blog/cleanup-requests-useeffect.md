---
title: Clean up request in the useEffect React Hook
published: true
description: 
date: 2019-08-28
---

# Clean up request in the useEffect React Hook

Creating a React application which will communicate with eternal API is very easy. However, sometimes you may get this warning message:

> Warning: Can’t perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

The message is not very clear and it does not give you information about what is really broken, especially when you see your application is working correctly. To visualize the problem let's imagine a simple application. It will have two buttons and two components. You click the first button and you render the first component, click on the second button renders the second component. And now add API connection - every component needs to make an API call to display data. The error happens when you click the first button and immediately click the second one not waiting for the first component to render. In this way, you can make a request but component gets unmounted before updating it. You need to clean it up after unmount - you need to cancel the request.

```jsx
const URL = "https://randomuser.me/api/";
const [data, setData] = useState(null);

useEffect(() => {
  fetch(URL)
    .then(results => results.json())
    .then(resp => { setData(resp.data)})
}, [URL]);

```

I created a simple React Hook for calling Random User API. When data is fetched it will be stored in the local state as data. If you use it in your component there is a possibility that you can see the error above on component unmount. Let's see how to prevent it.

## Clean up with AbortController

You can use [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
The AbortController allows you to abort one or more DOM requests as and when desired. It is a browser API and can be used without importing any library. Check the example below. I added new `abortController` inside `useEffect` hook. Fetch allows to pass the second argument, so I passed here `signal` instance. It can be used to abort a DOM request. The `useEffect` hook allows using a cleanup function. Anytime the effect is no longer valid anymore, for example when component using that effect is unmounting, this function will be called to clean everything. In our case, it is very helpful. Changing from one component to another will unmount the first one. During unmounting the component `useEffect` will call `abort()` method from `AbortController` to tell `fetch` and later the browser that this request is not needed anymore and can be canceled.

```jsx
const URL = "https://randomuser.me/api/";
const [data, setData] = useState(null);

useEffect(() => {
  const abortController = new AbortController();

  fetch(URL, { signal: abortController.signal})
    .then(results => results.json())
    .then(resp => { setData(resp.data)})

  return () => {
    abortController.abort();
  };
}, [URL]);

```

## Clean up with axios CancelToken

if you are using [Axios](https://github.com/axios/axios), I have also a similar solution. It is a very popular Http client library used very often in React projects and it provides a request canceling mechanism. In the very beginning, I created a cancel token using `CancelToken.source` factory. I added token to Axios request. The same as in the previous example `useEffect` allows returning another function when effect fallback when is not valid anymore. When a component is changed to another one it will unmount the first one causing `useEffect` to send a cancel signal using `source.cancel()`. Because it is canceled during the time a request is already started an error will be caught in `try...catch` block. Axios provides a method to check if an error was caused by request cancellation or is it something else.

```jsx
const URL = "https://randomuser.me/api/";
const [data, setData] = useState(null);

useEffect(() => {
  const source = axios.CancelToken.source();

  const loadData = async () => {
    try {
      const response = await Axios.get(URL, {
        cancelToken: source.token
      });
      setData(response.data);
    } catch (error) {
      if (Axios.isCancel(error)) {
        // request cancelled
      } else {
        throw error;
      }
    }

  };

  loadData()

  return () => {
    source.cancel();
  };
}, [URL]);
```

Both presented examples do the same thing. Your choice of the solution should depend on how you do Http request in your application. Axios provides also an additional method to check if a received error has occurred because of request cancellation. To verify if a selected solution is working play with it. Unmount your component before receiving the response and maybe add a timeout for the request to see it better. You should see a canceled request in Network tab in your browser. If you have any questions please ping me in the comments.