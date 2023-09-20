// import useSWR, { useSWRConfig } from "swr";
// import { useState, useEffect, useCallback } from "react";
// import { useNavigation } from "@react-navigation/native";

// import get from "lodash/get";
// import uniqBy from "lodash/uniqBy";
// import isEqual from "lodash/isEqual";
// import uniqWith from "lodash/uniqWith";
// import difference from "lodash/difference";

// import axios from "../axios.config";
// import { transformUrl } from "../utils";

// const useFetch = (url, options, isLazyLoading = true) => {
//   const navigation = useNavigation();
//   const controller = new AbortController();
//   const [isDone, setIsDone] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState(undefined);
//   const { mutate: globalMutate } = useSWRConfig();
//   const [shouldFetch, setShouldFetch] = useState(!isLazyLoading);

//   const [limit, setLimit] = useState(() => {
//     const _limit = get(options, "limit");

//     if (_limit) {
//       return _limit;
//     } else {
//       return 10;
//     }
//   });

//   const [historyUrl, setHistoryUrl] = useState(() => {
//     if (options === undefined) {
//       return [url];
//     }

//     return [transformUrl(url, options)];
//   });

//   const [fetchURL, setFetchURL] = useState(() => {
//     if (options === undefined) {
//       return url;
//     }
//     return transformUrl(url, options);
//   });

//   const { data: resData, error } = useSWR(() => {
//     if (fetchURL === null || !shouldFetch) {
//       return null;
//     }

//     return fetchURL;
//   });

//   useEffect(() => {
//     if (resData === undefined) {
//       return;
//     }

//     setFetchURL(resData.next);
//     setShouldFetch(false);

//     const nextURL = resData.next;

//     if (nextURL) {
//       setHistoryUrl((prev) => {
//         return [...prev, nextURL];
//       });
//     }

//     if (nextURL === null) {
//       setIsDone(true);
//     }

//     setData((prev) => {
//       if (Array.isArray(prev)) {
//         return uniqWith([...prev, ...resData.results], isEqual);
//       }

//       return resData.results;
//     });

//     setIsLoading(false);
//   }, [resData]);

//   useEffect(() => {
//     const unsubscribeBeforeRemove = navigation.addListener("beforeRemove", () => {
//       controller.abort();
//     });

//     return () => {
//       unsubscribeBeforeRemove();
//     };
//   }, [controller]);

//   const fetchMore = useCallback((data = true) => {
//     setIsLoading(true);
//     setShouldFetch(data);
//   }, []);

//   const setUrlHandler = useCallback((url, options = undefined) => {
//     setData([]);
//     setIsDone(false);
//     setIsLoading(true);
//     setShouldFetch(true);

//     if (options === undefined) {
//       setFetchURL(`${url}`);
//       setHistoryUrl([url]);
//     } else {
//       setFetchURL(transformUrl(url, options));
//       setHistoryUrl([transformUrl(url, options)]);
//     }
//   }, []);

//   const mutate = useCallback(
//     async (key) => {
//       try {
//         const oldHistoryList = [...historyUrl];
//         const newHistoryList = [historyUrl[0]];

//         await Promise.all(
//           historyUrl.map(async (el, index) => {
//             await globalMutate(el, async () => {
//               return axios
//                 .get(el, {
//                   signal: controller.signal,
//                 })
//                 .then(({ data }) => {
//                   const { next } = data;

//                   if (next) {
//                     newHistoryList[index + 1] = next;
//                   }
//                   setData((prev) => {
//                     if (prev) {
//                       const cloneData = [...prev];

//                       cloneData.splice(index * limit, limit, ...data.results);

//                       return uniqBy(cloneData, "self");
//                     } else {
//                       return prev;
//                     }
//                   });

//                   return data;
//                 });
//             });
//           })
//         );

//         const differenceList = difference(newHistoryList, oldHistoryList);

//         setHistoryUrl(newHistoryList);

//         if (differenceList.length > 0) {
//           setFetchURL(differenceList[0]);
//           setShouldFetch(true);
//         }
//       } catch (err) {}
//     },
//     [historyUrl, controller]
//   );

//   const removeElement = useCallback(
//     async (props) => {
//       try {
//         const { key, value } = props;

//         let historyIndex = 0;

//         setData((prev) => {
//           const cloneData = [...prev];

//           const index = cloneData.findIndex((el) => {
//             return el[key] === value;
//           });

//           historyIndex = Math.ceil((index + 1) / limit) - 1;

//           cloneData.splice(index, 1);

//           return cloneData;
//         });

//         await globalMutate(
//           historyUrl[historyIndex],
//           async (cacheData) => {
//             const { data: resData } = await axios.get(historyUrl[historyIndex], {
//               signal: controller.signal,
//             });

//             setData((prev) => {
//               let cloneData = uniqBy([...resData?.results, ...prev], key);

//               return cloneData;
//             });

//             return resData;
//           },
//           {
//             rollbackOnError: true,
//           }
//         );
//       } catch (err) {}
//     },
//     [historyUrl, controller]
//   );

//   const updateElement = useCallback(
//     async (props) => {
//       try {
//         const { key, value } = props;

//         let historyIndex = 0;
//         setData((prev) => {
//           const cloneData = [...prev];

//           const index = cloneData.findIndex((el) => {
//             return el[key] === value;
//           });

//           historyIndex = Math.ceil((index + 1) / limit) - 1;

//           return cloneData;
//         });

//         await globalMutate(
//           historyUrl[historyIndex],
//           async (cacheData) => {
//             const { data: resData } = await axios.get(historyUrl[historyIndex], {
//               signal: controller.signal,
//             });

//             setData((prev) => {
//               let cloneData = [...prev];

//               cloneData.splice(historyIndex * limit, limit, ...resData.results);

//               cloneData = uniqBy(cloneData, key);

//               return cloneData;
//             });

//             return resData;
//           },
//           {
//             rollbackOnError: true,
//           }
//         );
//       } catch (err) {}
//     },
//     [historyUrl, controller]
//   );

//   const cancelRequest = useCallback(() => {
//     controller.abort();
//   }, [controller]);

//   return {
//     data,
//     error,
//     mutate,
//     fetchMore,
//     isDone,
//     setUrl: setUrlHandler,
//     removeElement,
//     updateElement,
//     historyUrl,
//     cancelRequest,
//     isLoading,
//   };
// };

// export default useFetch;

export {};
