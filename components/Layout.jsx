import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from "antd";
import { useState, useCallback } from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import Container from "./Container";
import { logout } from "./../store/store";
import Link from "next/link";

const { Header, Content, Footer } = Layout;

const githubIconStyle = {
  color: "white",
  fontSize: 40,
  display: "block",
  paddingTop: 10,
  paddingRight: 20
};

const footerStyle = {
  textAlign: "center"
};

const MyLayout = ({ children, user, logout, router }) => {
  const urlQuery = router.query && router.query.query;

  const [search, setSearch] = useState(urlQuery || "");

  const userMenu = () => (
    <Menu>
      <Menu.Item onClick={handleLogout}>登 出</Menu.Item>
    </Menu>
  );

  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value);
  }, []);

  const handleOnSearch = useCallback(() => {
    router.push(`/search?query=${search}`);
  }, [search]);

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="logo">
              <Link href={"/"}>
                <Icon type="github" style={githubIconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search
                placeholder="搜索仓库"
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={userMenu}>
                  <Avatar size={40} src={user.avatar_url} />
                </Dropdown>
              ) : (
                <Tooltip title={"点击登录"}>
                  <a href={`/prepare-auth?url=${router.asPath}`}>
                    <Avatar size={40} icon="user" />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>
        Develop by zhuzhu @<a href="422914219@qq.com">422914219@qq.com</a>
      </Footer>
      <style jsx>
        {`
          .header-inner {
            display: flex;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: start;
          }
        `}
      </style>
      <style jsx global>
        {`
          #__next {
            height: 100%;
          }
          .ant-layout {
            min-height: 100%;
          }
          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }
          .ant-layout-content {
            background: #fff;
          }
        `}
      </style>
    </Layout>
  );
};

export default connect(
  state => {
    return {
      user: state.user
    };
  },
  dispatch => {
    return {
      logout: () => {
        dispatch(logout());
      }
    };
  }
)(withRouter(MyLayout));
