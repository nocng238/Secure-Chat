import { clientRoutes, pathToUrl, useFetch } from "../utils";

export const useGetChat = (fetchAgain) =>
  useFetch(fetchAgain ? pathToUrl(clientRoutes.chat) : null);
