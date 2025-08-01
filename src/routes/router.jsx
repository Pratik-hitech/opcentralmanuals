// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard ,{ loader as dashboardLoader } from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Overview from "../pages/Dashboard/components/Overview/index";
import Profile from "../pages/Dashboard/components/Profile/index";
import PrivateLayout from "../Layout/Privatelayout";
import OperationsManuals from "../pages/Operationsmanuals/OperationsManuals";
import ManualsDocs from "../pages/ManualsDocs/ManualsDocs";
import SideDocs from "../pages/ManualsDocs/components/SideDocs";
import NotFound from "../pages/NotFound";
import Reporting from "../pages/Reporting/Reporting";
import ReportingNews from "../pages/Reporting/components/ReportingNews";
import Test from "../pages/test/Test";
import Route1 from "../pages/test/components/Route1";
import Route2 from "../pages/test/components/Route2";
import ReportingOpManuals from "../pages/Reporting/components/ReportingOpManuals";
import ManageNews ,{loader as manageArticlesLoader} from "../pages/ManageNews/ManageNews";
import ManageUsers, {loader as manageUsersLoader} from "../pages/ManageUsers/ManageUsers"
import EditNews from "../pages/EditNews/EditNews";
import EditForm from "../pages/EditNews/components/EditForm";
import Permissions from "../pages/EditNews/components/Permissions";
// import ManageUsers from "../pages/ManageUsers/ManageUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
     
    children: [
      { index: true, element: <Dashboard />,
       loader: dashboardLoader,
       },
      
      // { path: "profile", element: <Profile /> },
      //   { path: "overview", element: <Overview /> },
      // add more dashboard sub-routes here
    ],
  },
  {
    path: "/overview",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Overview /> }, // this renders on /overview
    ],
  },
  {
    path: "/operations/manuals",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [{ index: true, element: <OperationsManuals /> }],
  },
  {
    path: "/operations/manuals/docs",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <ManualsDocs />, // this will show at /operations/manuals/docs
        children: [
          // { index: true, element: <div>Select a document</div> },
          { path: "policy/:id", element: <SideDocs /> }, // this will render inside ManualsDocs via <Outlet />
        ],
      },
    ],
  },
  {
    path: "/reporting",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Reporting />,
        children: [
          { index: true, element: <ReportingOpManuals /> },
          { path: "manuals", element: <ReportingOpManuals /> },
          { path: "news", element: <ReportingNews /> },
        ],
      },
    ],
  },
  {
    path: "/test",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Test />,
        children: [
          {
            index: true, // ✅ This means "/test" will load this route by default
            element: <Route1 />,
          },
          { path: "routetest1", element: <Route1 /> },
          { path: "routetest2", element: <Route2 /> },
        ],
      },
    ],
  },
  {
    path: "/manage/news",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    
    children: [{ index: true, element: <ManageNews /> ,
      loader: manageArticlesLoader, 
    }],
  },
  {
  path: "/manage/newsarticle",
  element: (
    <PrivateRoute>
      <PrivateLayout />
    </PrivateRoute>
  ),
  children: [
    {
      path: "create",
      element: <EditForm /> // Create mode (no ID)
    },
    {
      path: ":id",
      element: <EditNews />, // Parent layout for edit operations
      children: [
        {
          index: true,
          element: <EditForm /> // Edit mode (with ID)
        },
        { 
          path: "details", 
          element: <EditForm /> // Alternate edit view
        },
        { 
          path: "permissions", 
          element: <Permissions /> 
        }
      ]
    }
  ]
},
 {
    path: "/manage/users",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    
    children: [{ index: true, element: <ManageUsers /> ,
      loader: manageUsersLoader, 
      
    }],
  },

  // ✅ Catch-all route for 404
  {
    path: "*",
    element: <NotFound />,
  },
]);