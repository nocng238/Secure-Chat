import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { api } from "./axios";
export const fetcher = ({ queryKey }) => {
  const [url, params] = queryKey;
  return api.get(url, { params });
};

export const useFetch = (url, params, config) => {
  return useQuery([url, params], ({ queryKey }) => fetcher({ queryKey }), {
    enabled: !!url,
    ...config,
  });
};

export const useLoadMore = (url, params) => {
  return useInfiniteQuery(
    [url, params],
    ({ queryKey, pageParam = 1 }) => fetcher({ queryKey, pageParam }),
    {
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? false,
      getNextPageParam: (lastPage) => {
        return lastPage.nextId ?? false;
      },
    }
  );
};

const useGenericMutation = (func, url, params, updater) => {
  const queryClient = useQueryClient();

  return useMutation(func, {
    onMutate: async (data) => {
      await queryClient.cancelQueries([url, params]);

      const previousData = queryClient.getQueryData([url, params]);

      queryClient.setQueryData([url, params], (oldData) => {
        return updater ? updater(oldData, data) : data;
      });

      return previousData;
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([url, params], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries([url, params]);
    },
  });
};

export const usePost = (url, params, updater) => {
  return useGenericMutation(
    (data) => api.post(url, data),
    url,
    params,
    updater
  );
};

export const useUpdate = (url, params, updater) => {
  return useGenericMutation(
    (data) => api.patch(url, data),
    url,
    params,
    updater
  );
};

export const useDelete = (url, params, updater) => {
  return useGenericMutation(
    (id) => api.delete(`${url}/${id}`),
    url,
    params,
    updater
  );
};
