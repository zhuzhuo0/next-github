import WithRepoBasic from "../../components/with-repo-basic";

const Detail = ({ test }) => {
  return <span>Detail Page {test}</span>;
};

Detail.getInitialProps = async () => {
  return {
    test: "123"
  };
};

export default WithRepoBasic(Detail, 'index');
