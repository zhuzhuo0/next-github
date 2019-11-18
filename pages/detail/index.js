import WithRepoBasic from "../../components/with-repo-basic";
import { request } from './../../libs/api'

const Detail = ({ readme }) => {
  return <span>Detail Page</span>;
};

Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req } }) => {
  const readmeResp = await request({
    url: `/repos/${owner}/${name}/readme`
  }, req)

  return {
    readme: readmeResp.data
  }
};

export default WithRepoBasic(Detail, 'index');
