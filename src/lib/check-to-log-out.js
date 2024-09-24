import { routeAuth } from "@/configs/route.config";

export const checkToLogOut = (error) => {
  if (error.response.data.redirectToAuth) {
    window.location.href = `${routeAuth.logIn.pathname}?redirect-from=${window.location.pathname}`;
  }
};
