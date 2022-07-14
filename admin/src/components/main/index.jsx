import * as React from "react";
import css from "styled-jsx/css";
import {connect} from "react-redux";
import {Layout, Menu, Dropdown, Avatar} from "antd";
import {
    DownOutlined,
} from "@ant-design/icons";
import {Link, NavLink, withRouter} from "react-router-dom";

import {loadUser} from "@app/redux/actions";
import {LoadingPage} from '@app/components/core/loading';
import {LocalStore} from "@app/utils/local-storage";
import {envName} from "@app/configs";

import HomeIcon from '@app/resources/images/home_icon.svg'
import SelectedHomeIcon from '@app/resources/images/selected_home_icon.svg'

import UserIcon from '@app/resources/images/user_icon.svg'
import SelectedUserIcon from '@app/resources/images/selected_user_icon.svg'

import ServerIcon from '@app/resources/images/server_icon.svg'
import SelectedServerIcon from '@app/resources/images/selected_server_icon.svg'

import AdsIcon from '@app/resources/images/ads_icon.svg'
import SelectedAdsIcon from '@app/resources/images/selected_ads_icon.svg'

const {Header, Content} = Layout;

const menu = ({logout}) => (
    <Menu style={{borderRadius: 4}}>
        <Menu.Item key="1">
            <Link to={'/profile'}>Edit profile</Link>
        </Menu.Item>
        <Menu.Item key="2" onClick={logout}>Log out</Menu.Item>
    </Menu>
);

const Action = ({logout, userName = ''}) => (
    <Dropdown overlay={menu({logout})} trigger={["click"]}>
        <a className="ant-dropdown-link flex items-center" onClick={(e) => e.preventDefault()}>
            <Avatar src={"/images/favicon.png"} className="my-avatar" shape="circle" size="small"/>
            <span style={{marginLeft: 14}} className="flex items-center">
        <span className="user-name" style={{paddingRight: 32}}>{userName}</span>
        <DownOutlined width={24} height={24}/>
      </span>
        </a>
    </Dropdown>
);

const styles = css.global`
 .undefined {
    padding: 0 !important;
 }
.site-layout-background.header {
  height: 56px;
  border: solid 1px #e0e0e0;
  background-color: #ffffff;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
        font-size: 13px;
        line-height: 1.38;
        letter-spacing: 0.3px;
        color: #2a2a2c;
    }
    .my-avatar {
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 40px;
    }
    .logo {
      margin-right: 37px;
      img {
         width: 110px;
      }
    }
    .list-menu {
      li {
        a {
          font-size: 10px;
          font-weight: bold;
          line-height: 1.2;
          letter-spacing: 1.54px;
          position: relative;
          padding: 0 18px;
          height: 56px;
          display: flex;
          align-items: center;
          color: #9e9e9e;
          i {
            font-size: 16px!important;
            color: #9e9e9e;
            margin-right: 13px;
          }
          &.active {
            color: var(--primary-text-color);
            i {
              color: var(--primary-text-color);
            }
            &:after {
              width: 100%;
              height: 3px;
              background-color: #714fff;
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            }
          }
        }
      }
    }
}
`

class DefaultMain extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
    }

    isSelected = (name) => location.pathname.indexOf(name) > -1

    logOut = () => {
        const {history, loadUser} = this.props;
        LocalStore.local.remove(`${envName}-uuid`);
        loadUser();
    };

    getProfile = () => {
    };

    render() {
        const {children, user} = this.props;

        return (
            <Layout style={{minHeight: '100vh'}}>
                <Layout className="site-layout">
                    {user && (
                        <Header className="site-layout-background header">
                            <div className="logo">
                                <Link to={'/'}>
                                    <img src={"/images/logo.png"} alt=""/>
                                </Link>
                            </div>
                            <ul className="flex items-center flex-1 list-menu">
                                <li>
                                    <NavLink exact to="/" className="uppercase">
                                        <img src={this.isSelected('/') && location.pathname.length === 1 ? SelectedHomeIcon : HomeIcon} style={{width: 24, height: 24, color: '#9e9e9e'}}/>
                                        <div style={{marginTop: 3}}>Dashboard</div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/users" className="uppercase">
                                        <img src={this.isSelected('/users') ? SelectedUserIcon : UserIcon} style={{width: 24, height: 24, color: '#9e9e9e'}}/>
                                        <div style={{marginTop: 3}}>Users</div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/server" className="uppercase">
                                        <img src={this.isSelected('/server') ? SelectedServerIcon : ServerIcon} style={{width: 24, height: 24, color: '#9e9e9e'}}/>
                                        <div style={{marginTop: 3}}>Servers</div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/packs" className="uppercase">
                                        <img src={this.isSelected('/packs') ? SelectedServerIcon : ServerIcon} style={{width: 24, height: 24, color: '#9e9e9e'}}/>
                                        <div style={{marginTop: 3}}>Packs</div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/ads" className="uppercase">
                                        <img src={this.isSelected('/ads') ? SelectedAdsIcon : AdsIcon} style={{width: 24, height: 24, color: '#9e9e9e'}}/>
                                        <div style={{marginTop: 3}}>Ads</div>
                                    </NavLink>
                                </li>
                            </ul>
                            <Action userName={`${user?.firstname || ""} ${user?.lastname || ""}`} logout={this.logOut}/>
                        </Header>
                    )}
                    <Content
                        className={`site-layout-background ${!user ? "undefined" : ""}`}
                        style={{
                            minHeight: 280,
                            padding: "24px 74px",
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
                <style jsx>{styles}</style>
                {this.state.loading && <LoadingPage/>}
            </Layout>
        );
    }
}

const mapDispatchToProps = {
    loadUser,
};

const mapStatesToProps = (states) => ({
    user: states.global.user,
});

export default connect(
    mapStatesToProps,
    mapDispatchToProps
)(withRouter(DefaultMain));

