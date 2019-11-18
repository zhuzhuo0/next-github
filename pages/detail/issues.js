import { useState, useCallback, useEffect } from "react";
import { Avatar, Button, Select, Spin } from "antd";
import WithRepoBasic from "../../components/with-repo-basic";
import { request } from "../../libs/api";
import dynamic from "next/dynamic";
import { getLastUpdated } from "../../libs/utils";
import SearchUser from "../../components/SearchUser";

// markdown渲染组件
const MDRenderer = dynamic(() => import("../../components/MarkdownRender"));

// 用于缓存的对象
const CACHE = {};

// 显示issue详情
const IssueDetail = ({ issue }) => {
  return (
    <div className="root">
      <MDRenderer content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target={"_blank"}>
          打开Issue讨论页面
        </Button>
      </div>
      <style jsx>
        {`
          .root {
            background: #fafafa;
            padding: 20px;
          }
          .actions {
            text-align: right;
          }
        `}
      </style>
    </div>
  );
};

// 单条issue数据
const IssueItem = ({ issue }) => {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = useCallback(() => {
    // 防止闭包
    setShowDetail(detail => !detail);
  }, []);

  return (
    <div>
      <div className="issue">
        <Button
          type={"primary"}
          size={"small"}
          style={{
            position: "absolute",
            right: 10,
            top: 10
          }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "隐藏" : "查看"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {issue.labels.map(label => (
              <Label label={label} key={label.id} />
            ))}
          </h6>
          <p className="sub-info">
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
    </div>
  );
};

const Option = Select.Option;

// label组件
const Label = ({ label }) => {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>
        {`
          .label {
            display: inline-block;
            line-height: 20px;
            margin-left: 15px;
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 14px;
          }
        `}
      </style>
    </>
  );
};

// 组装参数
const makeQuery = (creator, state, labels) => {
  let creatorStr = creator ? `creator=${creator}` : "";
  let stateStr = state ? `state=${state}` : "";
  let labelStr = "";
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(",")}`;
  }
  const arr = [];
  if (creatorStr) arr.push(creatorStr);
  if (stateStr) arr.push(stateStr);
  if (labelStr) arr.push(labelStr);

  return `?${arr.join("&")}`;
};

const isServer = typeof window === "undefined";

const Issues = ({ initialIssues, labels, owner, name }) => {
  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState([]);
  const [issues, setIssues] = useState(initialIssues);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isServer) {
      CACHE[`${owner}/${name}`] = labels;
    }
  }, [owner, name, labels]);

  const handleCreatorChange = useCallback(value => {
    setCreator(value);
  }, []);

  const handleStateChange = useCallback(value => {
    setState(value);
  }, []);

  const handleLabelChange = useCallback(value => {
    setLabel(value);
  }, []);

  const handleSearch = useCallback(() => {
    setFetching(true);
    request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
    })
      .then(resp => {
        setIssues(resp.data);
        setFetching(false);
      })
      .catch(err => {
        console.error(err);
        setFetching(false);
      });
  }, [owner, name, creator, state, label]);

  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder="状态"
          onChange={handleStateChange}
          value={state}
          style={{ width: 200, marginLeft: 20 }}
        >
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        <Select
          mode={"multiple"}
          placeholder="Label"
          onChange={handleLabelChange}
          value={label}
          style={{ flexGrow: 1, marginRight: 20, marginLeft: 20 }}
        >
          {labels.map(la => (
            <Option value={la.name} key={la.id}>
              {la.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" disabled={fetching} onClick={handleSearch}>
          搜索
        </Button>
      </div>
      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="issues">
          {issues.map(issue => (
            <IssueItem issue={issue} key={issue.id} />
          ))}
        </div>
      )}
      <style jsx>
        {`
          .issues {
            border: 1px solid #eee;
            border-radius: 5px;
            margin-bottom: 20px;
            margin-top: 20px;
          }
          .search {
            display: flex;
          }
          .loading {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

Issues.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req
  }
}) => {
  const full_name = `${owner}/${name}`;

  const fetchs = await Promise.all([
    await request(
      {
        url: `/repos/${owner}/${name}/issues`
      },
      req
    ),
    CACHE[full_name]
      ? Promise.resolve({ data: CACHE[full_name] })
      : await request(
          {
            url: `/repos/${owner}/${name}/labels`
          },
          req
        )
  ]);

  return {
    owner,
    name,
    initialIssues: fetchs[0].data,
    labels: fetchs[1].data
  };
};

export default WithRepoBasic(Issues, "issues");
