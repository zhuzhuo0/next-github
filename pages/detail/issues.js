import WithRepoBasic from "../../components/with-repo-basic";

const Issues = ({ test }) => {
  return <span>Issues Page {test}</span>;
};

Issues.getInitialProps = async () => {
  return {
    test: "123"
  };
};

export default WithRepoBasic(Issues, "issues");
