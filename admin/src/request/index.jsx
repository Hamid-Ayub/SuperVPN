import axios from 'axios';
export const API = process.env.API || "/";
export const ENV = process.env.ENV_NAME || 'dev';
import { sha256 } from 'js-sha256';

const myHash = () => {
  const time = Date.now();
  return {
    time,
    hash: sha256(`${time}|${process.env.HASH_CODE}`),
  }
}

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
  },
  baseURL: API,
});

const headers = () => ({});

const getToken = () => {
  return localStorage.getItem(`strongvpn-${ENV}-uuid`)?.token || ""
}

const GET = (url, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.get(url, {
      params: {
        ...params,
      },
      headers: {
        ...headers(),
        authorization: `Bearer ${getToken()}`,
      },
    });
  }

  return axiosInstance.get(
    url,
    {
      params,
    },
  );
};

const DELETE = (url, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.delete(url, {
      params: {
        ...params,
      },
      headers: {
        ...headers(),
        authorization: `Bearer ${getToken()}`,
      },
    });
  }

  return axiosInstance.delete(url, {
    params,
  });
};

const POST = (url, formData, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.post(
      url,
      {
        ...formData,
        ...myHash()
      },
      {
        params: {
          ...params,
        },
        headers: {
          ...headers(),
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
  }

  return axiosInstance.post(
    url,
    {
      ...formData,
      ...myHash()
    },
    {
      params,
    },
  );
};

// tslint:disable-next-line: max-line-length
const FILE = (url, formData, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.post(
      url,
      formData,
      {
        params: {
          ...params,
        },
        headers: {
          ...headers(),
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
  }

  return axiosInstance.post(
    url,
    formData,
    {
      params,
    },
  );
};

const PUT = (url, formData, params = {}, isToken = false) => {
  if (isToken) {
    return axiosInstance.put(
      url,
      {
        ...formData,
        ...myHash()
      },
      {
        params: {
          ...params,
        },
        headers: {
          ...headers(),
          authorization: `Bearer ${getToken()}`,
        },
      },
    );
  }

  return axiosInstance.put(
    url,
    {
      ...formData,
      ...myHash()
    },
    {
      params,
    },
  );
};

export {
  GET,
  POST,
  PUT,
  DELETE,
  getToken,
  FILE,
  axiosInstance,
};
