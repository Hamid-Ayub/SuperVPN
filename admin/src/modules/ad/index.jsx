import Layout from "@app/components/layout";
import React from "react";
import {Switch, Dropdown, Menu, Modal, notification, Select} from "antd";
import UIButton from "@app/components/core/button";
import UITable from "@app/components/core/table";
import {PUT} from "@app/request";
import {EMAIL} from "@app/configs";
import {connect} from "react-redux";
import {CanView} from "@app/services/casl/ability";

const runFunction = (cb) => cb()

const staticData = [
  {
    os: "android",
    id: "android",
    banner: "11",
    show: "133"
  },
  {
    os: "ios",
    id: "ios",
    banner: "11",
    show: "133"
  }
]

const Ads = ({ global: { user }}) => {
  const [filter, setFilter] = React.useState({
    adsPlatform: 'android'
  })
  const [isReloadTable, setReloadTable] = React.useState("")
  const [changeValue, setChangeValue] = React.useState({
    id: undefined,
    value: undefined
  })

  const onUpdateAds = (form = {}) => {
    if (changeValue?.id || Object.values(form).length > 0) {
      PUT(`/admin/updateAdService/${form?.id || changeValue.id}`, {
        adminId: user?.id,
        adsType: form?.form?.adsType || changeValue?.form?.adsType,
        adsPlatform: form?.form?.adsPlatform || changeValue?.form?.adsPlatform,
        adsStatus: form?.form?.adsStatus ?? changeValue?.form?.adsStatus,
        adsId: form?.value || changeValue?.value
      })
      .then((result) => {
          notification.info({
            description: `Ads was updated successfully`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification info",
          });
          setChangeValue({
            id: undefined,
            value: undefined
          })
          setReloadTable((new Date().getTime().toString()))
        })
        .catch((err) => {
          console.log(err)
          notification.info({
            description: `Ads was updated failure`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification error",
          });
        })
    }
  }

  React.useEffect(() => {

  }, [])

  return (
    <Layout title="Ads">
      <div className="core-card">
        <div className="flex justify-between mb-4">
          <div className="flex">
            <div className="flex items-center">
              <div className="mr-3 pa-13 font-bold text-black">
                Filter by:
              </div>
              <Select
                value={filter?.adsPlatform}
                onChange={(e) => setFilter({...filter, adsPlatform: e})}
                placeholder="Platform" style={{width: 123}}>
                <Select.Option value={"android"}>Android</Select.Option>
                <Select.Option value={"ios"}>iOS</Select.Option>
              </Select>
            </div>
          </div>
          {
            changeValue?.id && (
              <CanView email={user.email}>
                <div className={"flex justify-end"}>
                  <UIButton onClick={() => {
                    setChangeValue({
                      id: undefined,
                      value: undefined
                    })
                    setReloadTable((new Date().getTime().toString()))
                  }} className="border mr-2">Cancel</UIButton>
                  <UIButton onClick={() => onUpdateAds()} className="secondary">Save</UIButton>
                </div>
              </CanView>
            )
          }
        </div>
        <UITable
          isReload={isReloadTable}
          customComp={{
            os: ({text}) => (
              <div className="text-left">
                {text}
              </div>
            ),
            adsId: ({text, row}) => (
              <div className="text-left">
                <input
                  onChange={({target: {value}}) => {
                    runFunction(() => {
                      setChangeValue({
                        value,
                        id: row?.id,
                        form: row,
                      })
                    })
                  }}
                  value={changeValue?.id === row?.id ? changeValue?.value : text}
                  placeholder="Ads Id"
                  className="w-full outline-none px-2 py-1"/>
              </div>
            ),
            action: ({row}) => (
              <span>
                <Switch onChange={(enable) => {
                  runFunction(() => {
                    onUpdateAds({
                      id: row?.id,
                      value: row?.adsId,
                      form: {
                        ...row,
                        adsStatus: enable
                      },
                    })
                  })
                }} defaultChecked={row?.adsStatus}/>
              </span>
            ),
          }}
          service={"/admin/getAdService"}
          isHiddenPg={false}
          defineCols={[
            {
              name: () => (
                <div className="text-left">
                  <span>Ads Id</span>
                </div>
              ),
              code: "adsId",
              sort: 1
            },
            {
              name: () => <div className="text-center">Ads Type</div>,
              code: "adsType",
              sort: 3
            },
            {
              name: () => <div className="text-center">Platform</div>,
              code: "adsPlatform",
              sort: 4
            },
            {
              name: () => <div className="text-center">Action</div>,
              code: "action",
              sort: 'end'
            }
          ]}
          queries={filter}
          payload={{
            adminId: user?.id
          }}
          headerWidth={{
            action: 92,
            adsName: 989,
            adsId: 215,
          }}
          columns={[]}
        />
      </div>
    </Layout>
  )
}

export default connect(state => state)(Ads)
