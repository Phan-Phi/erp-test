import { NextSeo, NextSeoProps } from "next-seo";

type SEOProps = {
  logo: any;
  defaultNextSeo?: NextSeoProps;
};

const SEO = (props: SEOProps) => {
  const { logo } = props;

  const favicon = logo ? logo.default : "";

  return (
    <NextSeo
      title={"ERP"}
      additionalLinkTags={[
        {
          rel: "icon",
          href: favicon,
        },
        {
          rel: "apple-touch-icon",
          href: favicon,
        },
      ]}
    />
  );
};

export default SEO;
