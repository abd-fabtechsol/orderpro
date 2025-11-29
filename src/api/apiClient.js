import { create } from "apisauce";
import { store } from "../redux/store";

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

function setAuthToken(token) {
  apiClient.setHeader("authorization", `Token ${token}`);
}

export { setAuthToken };
export default apiClient;
