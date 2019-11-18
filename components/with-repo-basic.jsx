import Repo from "./Repo";
import Link from "next/link";
import { withRouter } from "next/router";
import { get, cache } from "../libs/repo-basic-cache";
import { useEffect } from "react";

const { request } = require("./../libs/api");

const makeQuery = queryObject => {
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join("="));
      return result;
    }, [])
    .join("&");
  return `?${query}`;
};

const isServer = typeof window === "undefined";

export default (Comp, type = "index") => {
  const withDetail = ({ repoBasic, router, ...rest }) => {
    console.log(repoBasic);
    const query = makeQuery(router.query);

    useEffect(() => {
      if (!isServer) {
        cache(repoBasic);
      }
    });

    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === "index" ? (
              <span className="tab">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}
            {type === "issues" ? (
              <span className="tab">Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div>
          {/* 注意将目标组件的props传递给组件 */}
          <Comp {...rest} />
        </div>
        <style jsx>
          {`
            .root {
              padding-top: 20px;
            }
            .repo-basic {
              padding: 20px;
              border: 1px solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .tab + .tab {
              margin-left: 20px;
            }
          `}
        </style>
      </div>
    );
  };

  withDetail.getInitialProps = async context => {
    const { ctx } = context;
    const { owner, name } = ctx.query;

    const full_name = `${owner}/${name}`;

    let pageData = {};
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    }

    if (get(full_name)) {
      return {
        repoBasic: get(full_name),
        ...pageData
      };
    }

    const repoBasic = await request(
      {
        url: `/repos/${owner}/${name}`
      },
      ctx.req
    );

    return {
      repoBasic: repoBasic.data,
      ...pageData
    };
  };

  return withRouter(withDetail);
};
