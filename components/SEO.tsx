import { NextSeo, NextSeoProps } from "next-seo";

type SEOProps = {
  logo: any;
  defaultNextSeo?: NextSeoProps;
};

const SEO = (props: SEOProps) => {
  const { logo } = props;

  return (
    <NextSeo
      title={"ERP"}
      additionalLinkTags={[
        {
          rel: "icon",
          href: "",
          //   href: logo.default ? logo.default : "",
        },
        {
          rel: "apple-touch-icon",
          href: "",
          //   href: logo.default ? logo.default : "",
        },
      ]}
    />
  );
};

export default SEO;
