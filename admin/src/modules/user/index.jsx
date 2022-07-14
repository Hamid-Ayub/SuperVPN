import Layout from "@app/components/layout";
import React from "react";
import UISearch from "@app/components/core/input/search";
import {Dropdown, Menu, Modal, notification, Select} from "antd";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";
import Tag from "@app/components/core/tag";

import MoreIcon from '@app/resources/images/more.svg'
import {delay, encodeEmail, postDataWithFetch} from "@app/utils";
import {Link} from "react-router-dom";
import {LoadingPage2} from "@app/components/core/loading";
import {API, POST} from "@app/request";
import {EMAIL} from "@app/configs";
import {connect} from "react-redux";

const Users = ({global: {user}}) => {
    const [filter, setFilter] = React.useState({})
    const [isLoading, setLoading] = React.useState(false)
    const [userType, setUserType] = React.useState("users")
    //const [userType, setUserType] = React.useState("anonymous")
    const [userIds, setUserId] = React.useState([])
    const [searchValue, setSearch] = React.useState({search_by: "email", search: ""})
    const [isReloadTable, setReloadTable] = React.useState("")
    const [userInfo, setUserInfo] = React.useState(null)

    const formatMB = (num) => {
        return num !== 0 ? ((parseFloat(num || 0)) / (1024 * 1024)).toFixed(4) : 0
    }

    const onSearch = (value) => {
        if (value === "") {
            delay(() => {
                setReloadTable((new Date()).getTime().toString())
                setSearch({
                    ...searchValue,
                    search: ""
                })
            }, 300)
        } else {
            delay(() => {
                setSearch({
                    ...searchValue,
                    search: value
                })
            }, 300)
        }
    }

    const removeUsers = () => {
        Modal.confirm({
            title: `Are you sure want to delete users`,
            onOk: () => {
                setLoading(true)
                let delUser = []
                for (let i = 0; i < userIds.length; i++) {
                    delUser.push(
                        POST('/admin/users/delete', {
                            adminId: user?.id,
                            userId: userIds?.[i]?.id
                        })
                    )
                }
                Promise.all(delUser).then(() => {
                    setLoading(false)
                    notification.info({
                        description: `User successfully deleted!`,
                        placement: "bottomRight",
                        duration: 2,
                        icon: "",
                        className: "core-notification info",
                        onClose: () => {
                            setReloadTable((new Date()).getTime().toString())
                            setUserId([])
                        }
                    });
                }).catch(() => {
                    setLoading(false)
                    notification.info({
                        description: `Error removing user!`,
                        placement: "bottomRight",
                        duration: 2,
                        icon: "",
                        className: "core-notification error",
                        onClose: () => {

                        }
                    });
                });
            }
        })
    }

    // React.useEffect(() => {
    //   setReloadTable((new Date()).getTime().toString())
    // }, [])
    //
    //
    React.useEffect(() => {

    }, [])

    const isAllow = user?.email && user?.email?.toLowerCase() !== EMAIL

    return (
        <Layout title="Server" description="desc of server">
            <div className="core-card">
                <div className="flex justify-between">
                    {
                        userIds.length === 0 ? (
                                <div className="flex">
                                    <UISearch
                                        onChange={({target: {value}}) => onSearch(value)}
                                        onKeyDown={(event) => {
                                            const keyCode = event.which || event.keyCode;
                                            const {value: search} = event.target;
                                            if (keyCode === 13 && search) {
                                                setSearch({
                                                    ...searchValue,
                                                    value: search
                                                })
                                            }
                                        }}
                                        placeholder="Search User Name, Email"/>
                                    <div className="flex ml-10 items-center">
                                        <div className="mr-3 pa-13 font-bold text-black">
                                            Filter by:
                                        </div>
                                        {/*<Select*/}
                                        {/*  value={filter?.status}*/}
                                        {/*  onChange={(e) => setFilter({...filter, status: e})}*/}
                                        {/*  placeholder="All Status" style={{width: 123}}>*/}
                                        {/*  <Select.Option value="">All Status</Select.Option>*/}
                                        {/*  <Select.Option value={true}>Enable</Select.Option>*/}
                                        {/*  <Select.Option value={false}>Disable</Select.Option>*/}
                                        {/*</Select>*/}
                                        <div className="flex ml-3">
                                            <Select
                                                value={filter?.isAnonymous}
                                                onChange={(e) => setFilter({...filter, isAnonymous: e})}
                                                placeholder="User Type" style={{width: 123}}>
                                                <Select.Option value="">All User Type</Select.Option>
                                                <Select.Option value={"false"}>User</Select.Option>
                                                <Select.Option value={"true"}>Anonymous</Select.Option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )
                            : isAllow && (
                            <UIButton
                                onClick={isAllow && removeUsers}
                                className="third">
                                Remove user
                            </UIButton>
                        )
                    }
                </div>

                <div className="mt-6">
                    <UITable
                        onSelectAll={(e, a) => {
                            setUserId(a)
                        }}
                        customComp={{
                            status: ({text, row}) => <Tag className="uppercase" style={{width: 110}}
                                                          type={row?.premium ? 'primary' : 'second'}>{!row?.subscription ? 'Free' : 'Premium'}</Tag>,
                            action: ({row}) => (
                                <div className="flex items-center justify-center">
                                    <Dropdown
                                        align="bottomRight"
                                        overlayStyle={{width: 124}}
                                        overlay={
                                            isAllow
                                                ? (
                                                    <Menu style={{borderRadius: 4}}>
                                                        <Menu.Item key="0">
                                                            <Link to={`/users/${row?.id}/${userType}`}>
                                                                Detail
                                                            </Link>
                                                        </Menu.Item>
                                                        <Menu.Item key="3" onClick={() => {
                                                            Modal.confirm({
                                                                title: `Are you sure want to delete user ${row?.email}`,
                                                                onOk: () => {
                                                                    setLoading(true)
                                                                    POST('/admin/users/delete', {
                                                                        adminId: user?.id,
                                                                        userId: row?.id
                                                                    })
                                                                        .then(() => {
                                                                            notification.info({
                                                                                description: `User successfully deleted!`,
                                                                                placement: "bottomRight",
                                                                                duration: 2,
                                                                                icon: "",
                                                                                className: "core-notification info",
                                                                                onClose: () => {
                                                                                    setLoading(false)
                                                                                    setReloadTable((new Date()).getTime().toString())
                                                                                }
                                                                            });
                                                                        })
                                                                        .catch(() => {
                                                                            notification.info({
                                                                                description: `Error removing user!`,
                                                                                placement: "bottomRight",
                                                                                duration: 2,
                                                                                icon: "",
                                                                                className: "core-notification error",
                                                                                onClose: () => {
                                                                                    setReloadTable((new Date()).getTime().toString())
                                                                                }
                                                                            });
                                                                        })
                                                                }
                                                            })
                                                        }}>
                                                            Remove
                                                        </Menu.Item>
                                                    </Menu>
                                                )
                                                : (<span/>)
                                        }
                                        trigger={['click']}
                                    >
                                        <UIButton className="icon" style={{minWidth: 24}}>
                                            <img src={MoreIcon} alt="" width={24} height={24}/>
                                        </UIButton>
                                    </Dropdown>
                                </div>
                            ),
                            email: ({text, row}) => (
                                <div className="lowercase text-left">
                                    {
                                        isAllow ?
                                            (
                                                <Link to={`/users/${row?.id}/${userType}`} className="base-text"
                                                      style={{color: "#2a2a2c"}}>
                                                    {text || row?.id}
                                                </Link>
                                            ) : (
                                                <div className="base-text"
                                                     style={{color: "#2a2a2c"}}>
                                                    {encodeEmail(text || row?.id)}
                                                </div>)
                                    }

                                </div>
                            ),
                            totalDownload: ({text}) => <div className="">{formatMB(text || 0)}</div>,
                            totalUpload: ({text}) => <div className="">{formatMB(text || 0)}</div>,
                            subscription: ({text}) => <div className="">{text?.subscriptionType || 'Free'}</div>,
                        }}
                        isReload={isReloadTable}
                        service={"/admin/users"}
                        search={searchValue}
                        isHiddenPg={false}
                        queries={{
                            ...filter,
                            ...searchValue
                        }}
                        defineCols={[
                            {
                                name: () => (
                                    <div className="text-left flex items-center">
                                        <span>Email</span>
                                    </div>
                                ),
                                code: "email",
                                sort: 1
                            },
                            {
                                name: () => <div className="text-center">Status</div>,
                                code: "status",
                                sort: 2
                            },
                            {
                                name: () => <div className="text-center">Package</div>,
                                code: "subscription",
                                sort: 3
                            },
                            {
                                name: () => <div className="text-center">Download (MB)</div>,
                                code: "totalDownload",
                                sort: 4
                            },
                            {
                                name: <div className="text-center">Upload (MB)</div>,
                                code: "totalUpload",
                                sort: 5
                            },
                            {
                                name: () => <div className="text-center">Action</div>,
                                code: "action",
                                sort: 'end'
                            }
                        ]}
                        payload={{
                            adminId: user?.id
                        }}
                        headerWidth={{
                            email: 440,
                            action: 92,
                            upload: 220,
                            download: 220,
                            package: 152,
                            status: 152,
                        }}
                        columns={[]}
                        isAddParams={false}
                    />
                </div>
                {isLoading && <LoadingPage2/>}
            </div>
        </Layout>
    )
}

export default connect(state => state)(Users)
