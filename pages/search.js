import Router, { withRouter } from "next/router";
import { Row, Col, List, Pagination } from "antd";
import Link from "next/link";
import Repo from "../components/Repo";
import { isValidElement, useEffect } from "react";
import { cacheArray } from '../libs/repo-basic-cache'

const { request } = require("./../libs/api");

const LANGUAGE = ["JavaScript", "HTML", "CSS", "TypeScript", "Java", "Rust"];

const SORT_TYPES = [
  {
    name: "Best Match"
  },
  {
    name: "Most Stars",
    value: "stars",
    order: "desc"
  },
  {
    name: "Fewest Stars",
    value: "stars",
    order: "asc"
  },
  {
    name: "Most Forks",
    value: "forks",
    order: "desc"
  },
  {
    name: "Fewest Forks",
    value: "forks",
    order: "asc"
  }
];

/**
 * sort 排序方式
 * order 排序顺序
 * lang 仓库的项目开发诸语言
 * page 分页
 */

const selectedItemStyle = {
  borderLeft: "2px solid #e36209",
  fontWeight: "100"
};

const noop = () => { };

// github搜索限制，只会返回前1000个结果，大于1000 返回500

const per_page = 20;

const isServer = typeof window === 'undefined'

const FilterLink = ({ name, query, lang, sort, order, page }) => {
  //   const doSearch = config => {
  //     Router.push({
  //       pathname: "/search",
  //       query: {
  //         query,
  //         lang,
  //         sort,
  //         order
  //       }
  //     });
  //   };
  //   添加a标签路径显示
  let queryString = `?query=${query}`;
  if (lang) queryString += `&lang=${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryString += `&page=${page}`;
  queryString += `&per_page=${per_page}`;
  return (
    <Link href={`/search${queryString}`}>
      {isValidElement(name) ? name : <a>{name}</a>}
    </Link>
  );
};

const Search = ({ router, repos }) => {

  const { ...querys } = router.query;
  const { lang, sort, order, page } = router.query;

  useEffect(() => {
    if (!isServer) cacheArray(repos.items)
  })

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGE}
            renderItem={item => {
              let selected = lang === item;
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? (
                    <span>{item}</span>
                  ) : (
                      <FilterLink {...querys} lang={item} name={item} />
                    )}
                </List.Item>
              );
            }}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            dataSource={SORT_TYPES}
            renderItem={item => {
              let selected = false;
              if (item.name === "Best Match" && !sort) {
                selected = true;
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? (
                    <span>{item.name}</span>
                  ) : (
                      <FilterLink
                        {...querys}
                        order={item.order || ""}
                        sort={item.value || ""}
                        name={item.name}
                      />
                    )}
                </List.Item>
              );
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {repos.items.map(repo => (
            <Repo repo={repo} key={repo.id} />
          ))}
          <div className="pagination">
            <Pagination
              pageSize={per_page}
              current={Number(page) || 1}
              total={1000}
              onChange={noop}
              itemRender={(page, type, ol) => {
                const p =
                  type === "page"
                    ? page
                    : type === "prev"
                      ? page - 1
                      : page + 1;
                const name = type === "page" ? page : ol;
                return <FilterLink {...querys} page={p} name={name} />;
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>
        {`
          .root {
            padding: 20px 0;
          }
          .list-header {
            font-weight: 800;
            font-size: 16px;
          }
          .repos-title {
            border-bottom: 1px solid #eee;
            font-size: 24px;
            line-height: 50px;
          }
          .pagination {
            padding: 20px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query;
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    };
  }
  // ?q=react+language:javascript&sort=stars&order=desc
  let queryString = `?q=${query}`;
  if (lang) queryString += `+language:${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryString += `&page=${page}`;
  queryString += `&per_page=${per_page}`;

  const result = await request(
    {
      url: `/search/repositories${queryString}`
    },
    ctx.req
  );

  return {
    repos: result.data
  };
};

export default withRouter(Search);
