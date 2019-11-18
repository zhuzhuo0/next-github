import { useState, useCallback } from "react";
import { Avatar, Button } from "antd";
import WithRepoBasic from "../../components/with-repo-basic";
import { request } from "../../libs/api";
import dynamic from "next/dynamic";
import { getLastUpdated } from "../../libs/utils";

const MDRenderer = dynamic(() => import("../../components/MarkdownRender"));

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

const Issues = ({ issues }) => {
  console.log(issues);
  return (
    <div className="root">
      <div className="issues">
        {issues.map(issue => (
          <IssueItem issue={issue} key={issue.id} />
        ))}
      </div>
      <style jsx>
        {`
          .issues {
            border: 1px solid #eee;
            border-radius: 5px;
            margin-bottom: 20px;
            margin-top: 20px;
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
  const issuesResp = await request(
    {
      url: `/repos/${owner}/${name}/issues`
    },
    req
  );

  return {
    issues: issuesResp.data
  };
};

export default WithRepoBasic(Issues, "issues");
