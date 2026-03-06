import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicRouter, UserRouter, AdminRouter } from '~/Routers';

import DefaultLayout from '~/Layout/DefaultLayout';
import ProtectedRoute from '~/Routers/ProtectedRoute';

function App() {
  const router = createBrowserRouter([
    // public
    ...PublicRouter.map((item) => {
      let Layout = item.layout || DefaultLayout;
      const Page = item.component;
      return {
        path: item.path,
        element: (
          <Layout>
            <Page />
          </Layout>
        ),
      };
    }),
    // user
    ...UserRouter.map((item) => {
      let Layout = item.layout || DefaultLayout;
      const Page = item.component;
      return {
        path: item.path,
        element: (
          <ProtectedRoute role="user">
            <Layout>
              <Page />
            </Layout>
          </ProtectedRoute>
        ),
      };
    }),
    // admin
    ...AdminRouter.map((item) => {
      let Layout = item.layout || DefaultLayout;
      const Page = item.component;
      return {
        path: item.path,
        element: (
          <ProtectedRoute role="admin">
            <Layout>
              <Page />
            </Layout>
          </ProtectedRoute>
        ),
      };
    }),
  ]);

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default App;
