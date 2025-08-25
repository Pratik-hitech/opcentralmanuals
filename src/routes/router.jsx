// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard, { loader as dashboardLoader } from "../pages/Dashboard";
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
import ManageNews, {
  loader as manageArticlesLoader,
} from "../pages/ManageNews/ManageNews";
import ManageUsers, {
  loader as manageUsersLoader,
} from "../pages/ManageUsers/ManageUsers";
import EditNews from "../pages/EditNews/EditNews";
import EditForm from "../pages/EditNews/components/EditForm";
import Permissions from "../pages/EditNews/components/Permissions";
import { Navigate } from "react-router-dom";
import UserProfile from "../pages/UserProfile/UserProfile";
import UserProfileLayout from "../pages/UserProfile/components/UserProfileLayout";
import ActivityLog from "../pages/UserProfile/components/ActivityLog";
import FileManager from "../pages/UserProfile/components/FileManager";
import Opmanualsuser from "../pages/UserProfile/components/Opmanualsuser";
import UserForm, { userLoader } from "../pages/UserProfile/components/UserForm";
import ManageLocation from "../pages/ManageLocation/ManageLocation";
import LocationForm from "../pages/ManageLocation/components/LocationForm";
import DashboardNews, {
  dashboardNewsLoader,
} from "../pages/DashboardNews/DashboardNews";
import CreateManuals from "../pages/Operationsmanuals/components/CreateManuals";
import ManualsDetails from "../pages/Operationsmanuals/components/ManualsDetails";
import ManualsContent from "../pages/Operationsmanuals/components/ManualsContent";
import ManualsPermissions from "../pages/Operationsmanuals/components/ManualsPermissions";
import AllPolicies from "../pages/Operationsmanuals/components/AllPolicies";
import MediaFolderViewer from "../pages/FileManager/FileManager";
import CreatePolicies from "../pages/Operationsmanuals/components/policies/CreatePolicies";
import PolicyDetails from "../pages/Operationsmanuals/components/policies/PolicyDetails";
import PolicyPermissions from "../pages/Operationsmanuals/components/policies/Permissions";
import OperationsManual from "../pages/Operationsmanuals/components/manual/OperationsManual";

// import ManageUsers from "../pages/ManageUsers/ManageUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
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
      { index: true, element: <Dashboard />, loader: dashboardLoader },
    ],
  },
  {
    path: "/dashboardnews/:id",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardNews />, loader: dashboardNewsLoader },
    ],
  },
  {
    path: "/file-manager",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [{ index: true, element: <MediaFolderViewer /> }],
  },
  {
    path: "/overview",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [{ index: true, element: <Overview /> }],
  },
  {
    path: "/operations/manuals",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <OperationsManuals /> },
      { path: "policies/all", element: <AllPolicies /> },
    ],
  },
  {
    path: "/operations/manual/:id",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <OperationsManual /> },
      { path: "policy/:policyId", element: <OperationsManual /> },
    ],
  },
  {
    path: "/operations/manuals/policies",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <ManualsDocs />,
        children: [{ path: "policy/:id", element: <SideDocs /> }],
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

    children: [
      { index: true, element: <ManageNews />, loader: manageArticlesLoader },
    ],
  },

  {
    path: "/manuals/create",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <CreateManuals />,
        children: [
          {
            path: "details",
            element: <ManualsDetails />,
          },
          {
            path: "content",
            element: <ManualsContent />,
          },
          {
            path: "permission",
            element: <ManualsPermissions />,
          },
        ],
      },
    ],
  },
  {
    path: "/manuals/edit/:id",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <CreateManuals />,
        children: [
          {
            path: "details",
            element: <ManualsDetails />,
          },
          {
            path: "content",
            element: <ManualsContent />,
          },
          {
            path: "permission",
            element: <ManualsPermissions />,
          },
        ],
      },
      {
        path: "policies",
        element: <CreatePolicies />,
        children: [
          {
            path: "create/details",
            element: <PolicyDetails />,
          },
          {
            path: "edit/:policyId/details",
            element: <PolicyDetails />,
          },
          {
            path: "edit/:policyId/permissions",
            element: <PolicyPermissions />,
          },
          {
            path: "edit/:policyId/verification",
            element: <div>Verification Component</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/manage/newsarticle",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      //     {
      //   index: true,
      //   element: <Navigate to="create" replace />
      // },
      {
        path: "create",
        element: <EditNews />,
        children: [
          {
            index: true,
            element: <EditForm />, // Edit mode (with ID)
          },
          {
            path: "details",
            element: <EditForm />, // Alternate edit view
          },
          {
            path: "permissions",
            element: <Permissions />,
          },
        ], // Create mode (no ID)
      },
      {
        path: ":id",
        element: <EditNews />, // Parent layout for edit operations
        children: [
          {
            index: true,
            element: <EditForm />, // Edit mode (with ID)
          },
          {
            path: "details",
            element: <EditForm />, // Alternate edit view
          },
          {
            path: "permissions",
            element: <Permissions />,
          },
        ],
      },
    ],
  },
  {
    path: "/manage/users",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),

    children: [
      { index: true, element: <ManageUsers />, loader: manageUsersLoader },
    ],
  },

  // ******USERS PROFILE SECTION****

  //   {
  //   path: "/users/profile",
  //   element: (
  //     <PrivateRoute>
  //       <PrivateLayout />
  //     </PrivateRoute>
  //   ),
  //   children: [

  //     {
  //       index:true , element : <UserProfile />
  //     },
  // //     {
  // //   index: true,
  // //   element: <Navigate to="create" replace />
  // // },
  //     // {
  //     //   path: "create",
  //     //   element: <EditForm /> // Create mode (no ID)
  //     // },
  //     {
  //       path: ":userid",
  //       element: <UserProfile />, // Parent layout for edit operations
  //       children: [
  //         {
  //           index: true,
  //           element: <UserProfileLayout />
  //         },
  //         {
  //           path: "activitylog",
  //           element: <ActivityLog />
  //         },
  //         {
  //           path: "filemanager",
  //           element: <FileManager />
  //         },
  //          {
  //           path: "opmanuals",
  //           element: <Opmanualsuser />
  //         },
  //         //  {
  //         //   path: "permissions",
  //         //   element: <Permissions />
  //         // }
  //       ]
  //     }
  //   ]
  // },
  {
    path: "/users/profile",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/manage/users" replace />, // Redirect to users list if no ID
      },
      {
        path: ":userid",
        element: <UserProfile />,
        children: [
          {
            index: true,
            element: <UserProfileLayout />,
          },
          {
            path: "activitylog",
            element: <ActivityLog />,
          },
          {
            path: "filemanager",
            element: <FileManager />,
          },
          {
            path: "opmanuals",
            element: <Opmanualsuser />,
          },
        ],
      },
      {
        path: "activitylog",
        element: <Navigate to="/manage/users" replace />,
      },
      {
        path: "filemanager",
        element: <Navigate to="/manage/users" replace />,
      },
      {
        path: "opmanuals",
        element: <Navigate to="/manage/users" replace />,
      },
    ],
  },
  // {
  //   path : "/users/create",
  //   element : <UserForm />
  // },
  {
    path: "/users",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      // Create route
      {
        path: "create",
        element: <UserForm />, // Create mode
      },
      // Edit route
      {
        path: ":id/edit",
        element: <UserForm />, // Edit mode
        loader: userLoader,
      },
    ],
  },
  {
    path: "/location",
    element: (
      <PrivateRoute>
        <PrivateLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <ManageLocation /> },
      {
        path: "create",
        element: <LocationForm />,
      },
      {
        path: ":id/edit",
        element: <LocationForm />,
      },
    ],
  },

  // {
  //     path: "/users/profile/create",
  //     element: <UserForm />,
  //   },

  // ✅ Catch-all route for 404
  {
    path: "*",
    element: <NotFound />,
  },
]);
