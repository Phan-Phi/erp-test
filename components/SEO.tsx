import { NextSeo, NextSeoProps } from "next-seo";

type SEOProps = {
  logo: any;
  company_name: string;
  defaultNextSeo?: NextSeoProps;
};

const SEO = (props: SEOProps) => {
  const { logo, company_name } = props;

  const favicon = logo ? logo.default : "";
  const title = company_name ? `ERP - ${company_name}` : "ERP";

  return (
    <NextSeo
      title={title}
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
