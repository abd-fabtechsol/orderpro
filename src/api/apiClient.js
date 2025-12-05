import { create } from "apisauce";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
import { setSuppliers } from "../redux/supplierSlice";

const baseURL = "http://orderpro-env-1.eba-jn6vrmvc.us-east-2.elasticbeanstalk.com/api/v1/";

const apiClient = create({
  baseURL: baseURL,
});

// Endpoints that should not include auth token
const publicEndpoints = ['login/',  ];

apiClient.addRequestTransform((request) => {
  // Check if the request URL is a public endpoint (no token needed)
  const isPublicEndpoint = publicEndpoints.some(endpoint => request.url.includes(endpoint));

  if (isPublicEndpoint) return;

  const authToken = store?.getState()?.auth?.token;
  console.log(authToken,"ffffff34")
  if (!authToken) return;
  request.headers.authorization = "Bearer " + authToken;
});

// Handle 401/403 Unauthorized responses - logout user and navigate to login
apiClient.addResponseTransform((response) => {
  // Check for 401 or 403 with token_not_valid error
  const isUnauthorized = response.status === 401;
  const isTokenInvalid = response.status === 403 &&
    response.data?.errors?.code === 'token_not_valid';

  if (isUnauthorized || isTokenInvalid) {
    console.log('Token invalid/expired - Logging out user and redirecting to login');
    // Clear all user data
    store.dispatch(logout());
    // Clear supplier data
    store.dispatch(setSuppliers([]));
  }
});

function setAuthToken(token) {
  apiClient.setHeader("authorization", `Token ${token}`);
}

export { setAuthToken };
export default apiClient;
