---
title: Redux Saga Pattern for React
published: true
description: 
date: 2020-02-03
---

# Redux Saga Pattern for React

Building a React app can be difficult. Data is being shared among many components and having a lot of different states can make it very complex and hard to maintain. To handle that we usually use Redux - state management tool that allows keeping application state consistent and predictable. The state of the application is kept in a single global store, rather than at the component level, and each component can access it wherever it needs.
Here I will show you a Redux middleware used to handle side effect - Redux-Saga - a library that is based on generator functions and allows for synchronously written asynchronous code.

## Generators in ES6 Javascript

Generator functions are a new way of representing iterators introduced in ES6. It is a function that can be stopped and executed again, saving its context. Its different behavior can be presented by comparing to regular Javascript functions. The regular function will execute all instructions in its body every time it is invoked. In the code below a function `sayHello()` will return a string value `hello`. Every time we run this function we will receive this result. If its body will contain more instructions all of them will be executed one by one until a `return` statement is reached. The function can have multiple `return` statements, but when it is reached it will stop execution and return a value to the caller.

```javascript
function sayHello() {
  return 'hello';
}
sayHello();
// 'hello'
```
Generators work differently. It is a function that will return a Generator object when called. If it is assigned to a variable you can call a `next()` method to get an object that contains a value from the next stopping point and `done` flag to show the status of the function. Generator function uses a different syntax than a regular function. You define it using either `function* X` or `function *X`, both mean the same.

```javascript
function* sayHi() {
  yield 'hi';
}
const hiGen = sayHi();
hiGen.next();
// { value: 'hi', done: false }
```

Instead of `return` statement that will stop the generator, you use `yield` command for stopping point. An example below will show the difference in its behaviour.

```javascript
function* gen() {
	yield 'tommy';
	yield 'tommy2';
	return 'tommy3';
	yield 'tommy4';
}
const g = gen();
g.next();
// {value: "tommy", done: false}
g.next();
// {value: "tommy2", done: false}
g.next();
// {value: "tommy3", done: true}
g.next();
// {value: undefined, done: true}

```

You can also easily iterate over a Generator:

```javascript
const gen = function* () {
	yield 'tommy';
	yield 'tommy2';
	yield 'tommy3';
	yield 'tommy4';
}
const iterator = gen();

for (let val of iterator) {
  console.log(val);
}
```

The code I presented above use a `for ... of` loop. In this case, calls to next () are controlled by the loop. They are available through it "on the fly": the loop itself controls the occurrence of the true value of `done` property, and for each iteration, it returns the next value as `val` variable.

## redux-saga and configuration

Before starting on Redux-Saga I will explain what Saga is. It is a design pattern similar to Transactions, used to orchestrate many events that may occur in a distributed system in an undefined order. The time between events can be relatively long, so you should persuade its state while waiting for the next event. I found also that Saga is sometimes called Persistent Multi-Listener. It means that is is an object with a persistent state that can listen to many events.

`redux-saga` is a middleware for Redux which alows using ES6 generators for asynchronous calls. You can find more information on [library page](https://redux-saga.js.org/)

```
npm install --save-dev redux-saga
```

After installing `redux-saga` middleware we need to import `createSagaMiddleware` from it to `store.ts` file.

The rest of the code is pretty standard configuration - we call the `createSagaMiddleware` function, and its result is passed as a parameter called by the `applyMiddleware` function. It is important to assign a result to a variable. This is the object that we use at the end. As you can see, we pass the `rootSaga` function to it's `run()` function. A `rootSaga` is an object that combines all of our sagas, in this example I just import it from `./sagas/search`. Here is the code for this file:

```jsx
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/search';

export function makeStore(): Store<Action> {
  const sagaMiddleware = createSagaMiddleware();
  const store: Store = composeWithDevTools(applyMiddleware(sagaMiddleware))(createStore)(
    rootReducer,
    initialState
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
```
## Example application

To show a practical example I created an app for searching movies. It is very simple. You have input where you can type a movie name and a search button. It will send a request to [OMDB API](https://www.omdbapi.com/) and you will receive an array of movies in the response. To handle that I created four actions - `search()`,`searchRequestStarted()`, `updateMoviesState()`, `showError()`. First one is used to send a searchQuery parameter to API. Next `searchRequestStarted` is called from saga just before API request, it is used to set `isLoading` flag to `true` so it can be used for spinner. `updateMoviesState` will update movies state in Redux store with received results. If anything bad happens a `showError` action will be fired to show an Error message to the user.

```jsx
export const search = (searchQuery: string): ISearchAction => {
  return {
    type: SEARCH,
    payload: { searchQuery }
  };
};
export const searchRequestStarted = (): ISearchRequestStartedAction => {
  return {
    type: SEARCH_REQUEST_STARTED
  };
}

export const updateMoviesState = (data: IMovie[]): IUpdateMoviesStateAction => {
  return {
    type: UPDATE_MOVIES_STATE,
    payload: { data }
  };
};
export const showError = (errorMessage: string): IShowErrorAction => {
  return {
    type: SHOW_ERROR,
    payload: { errorMessage }
  };
};
```

Actions are handled in the `reducer` presented below. When a search is started an `isLoading` flag is changed so we know that request is in progress. When it is finished we changed it back to the `false` state. When a request was successful we will update movies state with received data, if not - an error message will be stored in movies state and data will be cleared so previous results will disappear from the screen. One can ask why `SEARCH_REQUEST_STARTED` is needed if we can react on `SEARCH` that initiates the process. The order here is very important, the saga is run before reducer, so when you start a search process you should dispatch first an action that will be used as a notification. If `isLoading` was changed in `SEARCH` action it will be changed after the request is done, so too late. Depending on the search request result we have two actions to update the state with results or with an error message. This could be done in one action, using `SEARCH` action only, but I like to do it this way as it is cleared code to me.

```jsx
export default function movies(
  state: IMoviesState = {} as IMoviesState,
  action: IMoviesAction
): IMoviesState {
  return produce(state, draft => {
    switch (action.type) {
      case SEARCH_REQUEST_STARTED: {
        draft.isLoading = true;
        draft.errorMessage = '';
        return;
      }
      case UPDATE_MOVIES_STATE: {
        draft.data = action.payload.data;
        draft.isLoading = false;
        return;
      }
      case SHOW_ERROR: {
        draft.data = [];
        draft.isLoading = false;
        draft.errorMessage = action.payload.errorMessage;
        return;
      }
    }
  });
}
```

The most important part here is a code from the saga. This file is full of functions provided by the library, but I will explain all of them. We have two types of sagas - watcher saga and worker saga. Watcher saga will listen to dispatched action and then it will run a worker an associated saga. At the very bottom, we export a rootSaga generator function. This is the one imported in `store.ts`. It uses `all` and `fork` effect to create an array of watcher saga with non-blocking calls. `watchSearchRequest` is a watcher saga using `takeEvery` effect. It listens to `SEARCH` action and every time this action occurs it will pause itself and let the `doSearchRequest` worker saga do the rest. There are a few different effects that can be used here, for example, `takeLatest` will run worker saga only for the latest action occurrence. The worker saga in the very beginning will call a function using `call` effect. The function is defined below and it is a simple API request made using `axios`. When we receive a response it will be used to update the movies state. For this purpose, we will dispatch an action from worker saga using `put` effect. When anything bad happens an error will be caught and an action `showError` will be dispatched and an error message will be sent to the store. This is a simple solution based on generators to handle an asynchronous API call. On every search action a searched text - searchQuery parameter - will be used to call omdbapi and response from omdb server will be next used to update redux state.

```jsx
import { takeEvery, put, fork, call, all} from 'redux-saga/effects';

function* doSearchRequest(action: ISearchAction): Generator {
  try {
    const response = yield call(searchMovies, action.payload.searchQuery);
    yield put(updateMoviesState((response as IResponse).data.Search));
  } catch (e) {
    yield put(showError(e.message));
  }
}

function* watchSearchRequest(): SagaIterator {
  yield takeEvery(SEARCH, doSearchRequest);
}

const searchMovies = (searchQuery: string): AxiosPromise => {
  return axios.request({
    url: 'https://omdbapi.com/?apikey=yourapikey&s=' + searchQuery,
    method: 'GET'
  });
};

export default function* rootSaga(): SagaIterator {
  yield all([fork(watchSearchRequest)]);
}
```

To start a search I added a small form in Search component, which will dispatch `searchRequestStarted`, `search` action on submit event. First one will change a `isLoading` flag so we know action is in progress, and second will start a search process.

```jsx
const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(searchRequestStarted());
    dispatch(search(searchTerm));
  };
```

The Movies component takes data from movies state and when state is updated it will display error message if any exists, or it maps data to display `Movie` components otherwise.

```jsx
	const mapState = useCallback(
    (state: IStore) => ({
      data: state.movies.data,
      errorMessage: state.movies.errorMessage
    }),
    []
  );
  const {
    data,
    errorMessage
  }: {
    data: IMovie[];
    errorMessage: string | undefined;
  } = useMappedState(mapState);

...

{errorMessage ? (
  <div className="alert alert-danger">{errorMessage || 'something went wrong'}</div>
  ) : (
  <div className="container pull-down">
    {data.map((movie: IMovie, i: number) => (
      <Movie movie={movie} key={i} />
    ))}
  </div>
)}
```

This is a very short and simple explanation of how a Redux-Saga pattern can be used to make asynchronous API calls using `redux-saga` library. This is of course introduction and the library provides a lot of effects that can be used to orchestrate many events and create complicated transactions. If you are interested in full source code, it is available on my [github page](https://github.com/tommybernaciak/saga-tutorial)