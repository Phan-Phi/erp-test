import createCache, { type EmotionCache } from "@emotion/cache";

const isBrowser = typeof document !== "undefined";

export default function createEmotionCache(): EmotionCache {
  let insertionPoint: HTMLElement | undefined;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: "mui-style", insertionPoint });
}
