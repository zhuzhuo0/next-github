import WithRepoBasic from "../../components/with-repo-basic";
import { request } from './../../libs/api'
import MDRenderer from '../../components/MarkdownRender'

const Detail = ({ readme }) => {
  return <MDRenderer content={readme.content} isBase64={true} />
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
