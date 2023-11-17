const START_URL = 'https://jsonplaceholder.typicode.com';

export const fetchData = async (params) => {
  const URL = params.queryKey[0];
  const result = await fetch(`${START_URL}${URL}`);
  return result.json();
};
