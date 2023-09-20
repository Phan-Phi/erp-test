import React, { forwardRef } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";

interface ExtendNextLinkProps extends NextLinkProps {
  noLinkStyle?: boolean;
  children?: React.ReactNode;
}

type ConditionalProps =
  | ({ noLinkStyle?: false } & MuiLinkProps)
  | ({ noLinkStyle: true } & Omit<
      React.ComponentPropsWithoutRef<"a">,
      keyof ExtendNextLinkProps
    >);

type Props = ExtendNextLinkProps & ConditionalProps;

const Link = forwardRef(function Link<C extends React.ElementType>(
  props: Props,
  ref?: React.ComponentPropsWithRef<C>["ref"]
) {
  const { href, noLinkStyle = false, ...others } = props;

  const isExternal =
    typeof href === "string" &&
    (href.indexOf("http") === 0 ||
      (href.indexOf("mailto:") === 0 && href.indexOf("tel:") === 0));

  if (isExternal) {
    if (noLinkStyle) {
      return (
        <a href={href} ref={ref} {...(others as React.ComponentPropsWithoutRef<"a">)} />
      );
    } else {
      return <MuiLink href={href} ref={ref} {...others} />;
    }
  } else {
    if (noLinkStyle) {
      return <NextLinkComposed ref={ref} href={href} {...others} />;
    } else {
      if (typeof href === "string") {
        return (
          <MuiLink
            component={NextLinkComposed}
            href={href || undefined}
            ref={ref}
            {...others}
          />
        );
      } else {
        return null;
      }
    }
  }
});

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkProps>(
  function NextLinkComposed(props, ref) {
    const { href, as, replace, scroll, passHref, shallow, prefetch, locale, ...others } =
      props;

    return (
      <NextLink
        href={href}
        prefetch={prefetch}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        locale={locale}
      >
        <a ref={ref} {...others} />
      </NextLink>
    );
  }
);

export default Link;
