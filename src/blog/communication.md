We have to inject the React application into the Angular application to allow communication and share sessions between applications. This way we can send messages using the postMessage method. The application needs to be injected in the root of the application so it will be available from the beginning of the application lifecycle. This allows us to modify the React application localStorage as it is available when the user is still using the Angular application and by that session can be set or modified.

Injecting React application
React app instance is included by IframeController in the index page (app/index.html):



<div ng-controller="IframeCtrl"></div>
The IframeController (app/scripts/controllers/iframe.coffee) has a fundamental logic to include the iframe element with the React application instance. Note that the application is injected but not visible to the user.



class IframeCtrl
  @$inject: ['$scope','REACT_APP_DOMAIN']
  constructor: (@$scope, @REACT_APP_DOMAIN) ->
    if @REACT_APP_DOMAIN
      reactApp = document.createElement('iframe');
      reactApp.id = 'REACT_APP';
      reactApp.src = @REACT_APP_DOMAIN;
      reactApp.title = 'react-app-scoop';
      reactApp.style.cssText = 'display: none;';
      document.body.appendChild(reactApp);


angular.module('scoopApp').controller 'IframeCtrl', IframeCtrl
Communication service
Communication is done using the WindowMessage service (app/scripts/services/window_message.coffee). It allows to sending of messages to the injected React application and to the parent application (application that injects Angular application). In other words we can send messages down or up, depending on the requirements.  Code is shown below:



"use strict";

angular.module('scoopApp').factory 'WindowMessage', [
  '$location', 
  '$timeout',
  'Auth', 
  'GoToHomePage',
  '_',
  'REACT_APP_DOMAIN',
  ($location, $timeout, Auth, GoToHomePage, _, REACT_APP_DOMAIN) ->

    send = (message) ->
      reactAPP = document.getElementById('REACT_APP')
      if reactAPP
        reactAPP.contentWindow.postMessage message, '*'
      return

    sendToParent = (message) ->
      top = window.top
      if top != null
        top.postMessage message, '*'
      return

    logout = ->
      send type: 'LOGOUT'
      $timeout =>
        document.location.reload()
      return

    login = (email, password) ->
      send
        type: 'LOGIN'
        email: email
        password: password
      return

    updateUser = (companyId) -> 
      send
        type: 'UPDATE_USER'
        companyId: companyId

    logoutParent = ->
      sendToParent type: 'LOGOUT'
      $timeout =>
        document.location.reload()
      return

    window.onmessage = (event) ->
      if event.origin != REACT_APP_DOMAIN
        return
      if event.data.type == 'LOGOUT'
        Auth.signOut().then ->
          logoutParent()
          return
      return

    {
      logout: logout
      login: login
      updateUser: updateUser,
    }
]
Currently, we support 3 actions: logout, login, updateUser but any new action can be easily added. This service also listens to incoming messages from the React application. Currently, it listens for LOGOUT messages only, but new events can be added.

This information can be read by the React application. The code for it is in the useSetLocalStorageFromAngular hook (src/hooks/useSetLocalStorageFromAngular.hook.ts).



import { ANGULAR_APP_DOMAIN } from '~config/env';
import { useUserContext } from '~providers/user/User.provider';
import RequestService from '~request/Request.service';

export enum MessageActionType {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  UpdateUser = 'UPDATE_USER',
}

const useSetLocalStorageFromAngular = async () => {
  const { signIn, updateCurrentUser, signOut } = useUserContext();

  const receiveMessage = async (e: MessageEvent<any>) => {
    if (e.origin !== ANGULAR_APP_DOMAIN) {
      // console.error('Origin domain not allowed: ', e.origin);
      return;
    }
    const messageType = e.data.type;

    if (messageType === MessageActionType.Login) {
      const { email, password } = e.data;
      await signIn({ email, password });
    }

    if (messageType === MessageActionType.Logout) {
      await signOut();
      const angularApp = document.getElementById('angular-iframe');
      if (angularApp) {
        angularApp.remove();
      }
    }

    if (messageType === MessageActionType.UpdateUser) {
      const { companyId } = e.data;
      if (companyId) {
        RequestService.setCompanyId(companyId);
      }
      await updateCurrentUser();
    }
  };

  window.onmessage = (event) => {
    receiveMessage(event);
  };
};

export default useSetLocalStorageFromAngular;
It uses window.onmessage event listener to handle incoming messages. For Each supported message type a specific action is fired.

Here is a list of supported communication scenarios:

Login (from Angular application).

Logout (from Angular application).

Update User (from Angular application, used for example to switch company)

Logout (From React application).

Communication from Angular to React (Login)
When the user logs in from the Angular application a signIn action is fired. When it is successful it runs signInSuccess callback. (app/scripts/controllers/signin.coffee)



signIn: ->
    @loading = true
    @Auth.signIn(@credentials.email, @credentials.password)
      .then(
        (user) => @signInSuccess(@credentials.email, @credentials.password)
        (error) => @alert = {type: 'danger', message: error}
      ).finally =>
        @loading = false
signInSuccess action calls WindowMessage service to run login action with user credentials.  (app/scripts/controllers/signin.coffee)



signInSuccess:(email, password) ->
    @WindowMessage.login(email, password)
    returnUrl = @$location.search().returnTo
    if @_.isBlank(returnUrl) and !@fromState.name
      @GoToHomePage.goHome()
    else if !@_.isBlank(returnUrl)
      @$location.path returnUrl
    else
      @$state.go(@fromState.name, @fromParams)
WindowMessage service sends credentials with a message type to the React application. (app/scripts/services/window_message.coffee)



login = (email, password) ->
      send
        type: 'LOGIN'
        email: email
        password: password
      return
React application catches the message and runs a signIn action.



if (messageType === MessageActionType.Login) {
      const { email, password } = e.data;
      await signIn({ email, password });
    }
The signIn action is a signIn request - when it is successful user is logged in and session data is stored in the localStorage. Note that the user is still using the Angular application, and the React sign-in action is not visible to the user. In other words, when the user makes a supported action in the Angular application, it runs also in the React application which is injected but stays in the background and is not displayed. This gives us access to the React application localStorage before the user is redirected to this application. When the user finally gets redirected to the React app he will be already logged in, since this action was already done and the session is stored in localStorage. 
The same approach is used for the logout or updateUser actions.

Communication from React to Angular (Logout)
A slightly different approach is used when a message needs to be sent from a React application to an Angular application. The only action supported for now is logout. When the user clicks on a logout button on the React application a sendSignOutSignal action is fired (src/helpers/sendMessageToAngularApp.helper.ts). 



const sendMessageToAngularApp = async (message: {
  type: MessageActionType;
}) => {
  const angularApp = document.createElement('iframe');
  angularApp.id = 'angular-iframe';
  angularApp.src = ANGULAR_APP_DOMAIN;
  angularApp.title = 'angular-app-scoop';
  angularApp.style.cssText = 'display: none;';

  angularApp.onload = () => {
    angularApp.contentWindow?.postMessage(message, ANGULAR_APP_DOMAIN);
  };

  document.body.appendChild(angularApp);
};

export default sendMessageToAngularApp;
This injects a hidden Angular application into the React application and sends a message using the postMessage function. This message is watched in Angular WindowMessage service:



window.onmessage = (event) ->
      if event.origin != REACT_APP_DOMAIN
        return
      if event.data.type == 'LOGOUT'
        Auth.signOut().then ->
          logoutParent()
          return
      return
When a message is recognized as LOGOUT user is signed out from the Angular application and logoutParent() action is run. This action sends a LOGOUT message back to the React application:



logoutParent = ->
      sendToParent type: 'LOGOUT'
      $timeout =>
        document.location.reload()
      return
React application gets back a LOGOUT message, which means that the user is successfully logged out of the Angular application and can be signed out from React as well. After successful signout from the React application iframe with the Angular application is removed.



if (messageType === MessageActionType.Logout) {
      await signOut();
      const angularApp = document.getElementById('angular-iframe');
      if (angularApp) {
        angularApp.remove();
      }
    }
 

Q&A
When React application is first loaded?

React application is first loaded when the user comes to the Angular application. It is just injected as a hidden instance but it exists. This allows to access the localStorage of the React application when a user is still in the Angular. This also means that we should be careful about actions that are fired on load on the React application, as this will happen not only when the user is redirected to React, but also when he first comes to the Angular application.

Why React application can’t inject the Angular application in the same way as Angular does with React?

To avoid infinite loops and browser freeze. The Angular application injects React in the very beginning, if React would do the same for Angular, then Angular in the background will inject another instance of React which will inject another instance of Angular….

What is the main difference between those two types of communication?

When the user comes to Angular it immediately adds an instance of a hidden React app. When action is supported by WindowMessage service a message is sent to the React app and its state is updated. When the user is redirected an updated state from localStorage is used in the React app.

When a user is in the React application and does an action that needs to be sent to Angular, the instance of Angular application is created and injected, but kept hidden. Then a message is sent and the Angular application does a specific action and sends back a new message to the React application. It is then catched and the React application can act on it properly. 

