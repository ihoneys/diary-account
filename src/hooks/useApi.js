import React, { useEffect, useState } from 'react'

const getList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([3, 333, 111, Math.random() * 10])

    }, 2000)
  })
}

const useApi = () => {
  const [data, setData] = useState([1, 2, 3, 4]);
  const [query, setQuery] = useState('');
  useEffect(async () => {
    const result = await getList();
    setData(result);
  }, [query])

  return [{ data }, setQuery];
}

export default useApi;