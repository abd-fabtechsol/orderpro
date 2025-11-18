import { create } from "apisauce";
import { store } from "../redux/store";

const baseURL = "https://votes-pediatric-established-either.trycloudflare.com/api/v1/";

const apiClient = create({
  baseURL: baseURL,
});

apiClient.addRequestTransform((request) => {
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
