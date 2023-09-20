import { useMemo } from "react";
import { useRouter } from "next/router";

import English from "locale/original/en.json";
import Vietnamese from "locale/original/vi.json";

const useTranslate = () => {
  const router = useRouter();
  const { locale, defaultLocale } = router;

  const messages = useMemo(() => {
    if (locale === "vi") {
      return Vietnamese;
    } else if (locale === "en") {
      return English;
    }
  }, [locale]);

  return { messages, locale, defaultLocale };
};

export default useTranslate;
