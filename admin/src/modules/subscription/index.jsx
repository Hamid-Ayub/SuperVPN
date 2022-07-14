import Layout from "@app/components/layout";
import React from "react";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";
import {Dropdown, Menu, Select} from "antd";
import MoreIcon from "@app/resources/images/more.svg";
import {PackDetail} from "@app/modules/subscription/components/detail";
import {EMAIL} from "@app/configs";
import {connect} from "react-redux";
import {PremiumServer} from "@app/modules/server/components/detail";

const Subscription = ({ global: { user }}) => {
  const [filter, setFilter] = React.useState({
    packagePlatform: 'android'
  })
  const [isReloadTable, setReloadTable] = React.useState("")
  const [showAddPack, setShowAddPack] = React.useState({
    status: false,
    data: undefined,
  });

  const isAllow = user?.email && user?.email?.toLowerCase() !== EMAIL

  return (
    <Layout className="" title="Boost">
      <div className="core-card">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex items-center">
              <div className="mr-3 pa-13 font-bold text-black">
                Filter by:
              </div>
              <Select
                value={filter?.packagePlatform}
                onChange={(e) => setFilter({...filter, packagePlatform: e})}
                placeholder="Platform" style={{width: 123}}>
                <Select.Option value={"android"}>Android</Select.Option>
                <Select.Option value={"ios"}>iOS</Select.Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <UITable
            customComp={{
              packageName: ({text}) => <div className="text-left">{text}</div>,
              packageId: ({text}) => <div className="lowercase">{text}</div>,
              pricing: ({text}) => <div className="text-left">${text}</div>,
              action: ({row}) => (
                <div className="flex items-center justify-center">
                  <Dropdown
                    align="bottomRight"
                    overlayStyle={{width: 124}}
                    overlay={
                      <Menu style={{borderRadius: 4}}>
                        <Menu.Item
                          key="0"
                          onClick={() => isAllow &&
                            setShowAddPack({
                              data: row,
                              status: true,
                            })
                          }
                        >
                          Edit
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                  >
                    <UIButton className="icon" style={{minWidth: 24}}>
                      <img src={MoreIcon} alt="" width={24} height={24}/>
                    </UIButton>
                  </Dropdown>
                </div>
              ),
            }}
            service={`/admin/getPackage`}
            isHiddenPg={false}
            defineCols={[
              {
                name: () => (
                  <div className="text-left flex items-center">
                    <span>Pack name</span>
                  </div>
                ),
                code: "packageName",
                sort: 1,
              },
              {
                name: () => <div className="text-center">pricing</div>,
                code: "packagePricing",
                sort: 2,
              },
              {
                name: () => <div className="text-center">Purchase Id</div>,
                code: "packageId",
                sort: 4,
              },
              {
                name: () => <div className="text-center">duration</div>,
                code: "packageDuration",
                sort: 5,
              },
              {
                name: () => <div className="text-center">platform</div>,
                code: "packagePlatform",
                sort: 6,
              },
              {
                name: () => <div className="text-center">Action</div>,
                code: "action",
                sort: "end",
              },
            ]}
            payload={{
              adminId: user?.id
            }}
            queries={filter}
            headerWidth={{
              username: 194,
              action: 92,
              bought: 92,
              like: 92,
              wallet: 70,
              followers: 126,
              following: 126,
              boost_date: 126,
              bought_date: 126,
              bought_completion: 253,
            }}
            columns={[]}
            isReload={isReloadTable}
          />
        </div>
      </div>
      {showAddPack?.status && (
        <PackDetail
          user={user}
          data={showAddPack?.data}
          onClose={() =>
            setShowAddPack({
              data: undefined,
              status: false,
            })
          }
          cb={() => setReloadTable((new Date()).getTime().toString())}
        />
      )}
    </Layout>
  );
};

export default connect(state => state)(Subscription)
