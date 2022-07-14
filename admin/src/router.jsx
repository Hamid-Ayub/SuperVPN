import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import DefaultMain from "@app/components/main";
import PrivateRoute from "@app/components/private-route";
import {LoadingPage} from "@app/components/core/loading";

const routes = [
  {
    name: "Login",
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/login'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/login',
    id: 'login',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: "Sign up",
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/sign-up'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/sign-up',
    id: 'sign-up',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: "request pass",
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/request-pass'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/request-password',
    id: 'request-password',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: "reset-password",
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/reset-password'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/change-password',
    id: 'change-password',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: "reset-password-success",
    component: React.lazy(() => Promise.all([
      import('@app/modules/auth/components/success'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/success',
    id: 'success',
    exact: true,
    private: false,
    can: 'view'
  },
  {
    name: "Home",
    component: React.lazy(() => Promise.all([
      import('@app/modules/home'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/',
    id: 'home',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: "Server",
    component: React.lazy(() => Promise.all([
      import('@app/modules/server'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/server',
    id: 'server',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: "Pack",
    component: React.lazy(() => Promise.all([
      import('@app/modules/subscription'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/packs',
    id: 'packs',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: "Ads",
    component: React.lazy(() => Promise.all([
      import('@app/modules/ad'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/ads',
    id: 'ads',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: "User Detail",
    component: React.lazy(() => Promise.all([
      import('@app/modules/user/component/detail'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/users/:id/:type',
    id: 'users-detail',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: "User",
    path: '/users',
    component: React.lazy(() => Promise.all([
      import('@app/modules/user'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    id: 'users',
    exact: true,
    private: true,
    can: 'view'
  },
  {
    name: "My Profile",
    component: React.lazy(() => Promise.all([
      import('@app/modules/user/component/profile'),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .then(([moduleExports]) => moduleExports)),
    path: '/profile',
    id: 'profile',
    exact: true,
    private: true,
    can: 'edit'
  }
]

const MakeRoute = () => (
  <DefaultMain>
    <React.Suspense fallback={<LoadingPage/>}>
      <Switch>
        {
          routes.map((route) => (
            !route?.private
              ? <Route
                exact={route.exact || false}
                path={route.path}
                key={route.id}
                render={(props) => {
                  return <route.component {...props}/>
                }}
              />
              : <PrivateRoute
                can={route.can}
                exact={route.exact || false}
                path={route.path}
                key={route.id}
                component={route.component}
              />
          ))
        }
        <Route render={() => (
          <div>Not Found</div>
        )}/>
      </Switch>
    </React.Suspense>
  </DefaultMain>
);

export default MakeRoute;
