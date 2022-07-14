import {Form, Input, notification, Select} from "antd";
import UICPopup from "@app/components/core/popup/cpopup";
import React from "react";
import * as Yup from "yup";
import {Formik} from 'formik'
import {GET, POST} from "@app/request";
import UIButton from "@app/components/core/button";
import {getBase64} from "@app/utils";
import CancelIcon from '@app/resources/images/cancel.svg'
import {EMAIL} from "@app/configs";
import axios from "axios";

export const PremiumServer = ({onCloseServe, isPremium = true, cb, data = undefined, user}) => {
  let fileSelector = undefined;
  const [countries, setCountry] = React.useState([])
  const [states, setState] = React.useState([])
  const [errorState, setErrorState] = React.useState(false)
  const [formData, setFormData] = React.useState({
    country: "",
    countryCode: "",
    ipAddress: "",
    premium: isPremium,
    state: "",
    status: false,
    recommend: false,
    caFile: "",
    caFileName: "",
    u_nsm: "",
    p_nsm: "",
  })

  const validateSchema = Yup.object({
    country: Yup.string()
      .required("Please select server"),
    ipAddress: Yup.string()
      .required("Please input ip address"),
    u_nsm: Yup.string()
      .required("Please input username"),
    p_nsm: Yup.string()
      .required("Please input password"),
    status: Yup.string()
      .required("Please select status"),
    recommend: Yup.boolean()
      .required("Please select recommend"),
    caFile: Yup.string()
      .required("Please upload cert file (*.pem)*"),
  })

  React.useEffect(() => {
    fetchCountries()

    if (data) {

      setFormData({
        ...formData,
        country: data?.country,
        countryCode: data?.countryCode,
        status: data?.status,
        recommend: data?.recommend,
        ipAddress: data?.ipAddress,
        caFileName: data?.caFileName,
        state: data?.state,
        caFile: data?.caFile,
        u_nsm: data?.u_nsm,
        p_nsm: data?.p_nsm,
      })
    }
  }, [])

  const fetchCountries = async () => {
    const res = await axios.get('/data/countries_v1.json')

    setCountry(res?.data || [])

    if (data) {
      filterState(data?.countryCode, res?.data || [])
    }
  }

  const filterState = (countryCode, list) => {
    const filtered = list.filter((item) => (item?.iso2).toLowerCase() === countryCode)

    setState(filtered?.[0]?.states)
  }

  const removeError = ({errors, name, setErrors}) => {
    const newErrors = {...errors};
    delete newErrors?.[name];
    setErrors({...newErrors});
  };

  const handleFileSelect = () => {
    fileSelector?.click();
  };

  const onChoose = (event, setFieldValue, errors, setErrors, contentName = "caFile", fileName = "caFileName") => {
    const file = event.target.files[0];

    // const tmppath = URL.createObjectURL(file);
    getBase64(file)
      .then((content) => {

        let tmp = content?.split("base64,")?.[1] || ""
        setFieldValue(contentName, tmp, false)
        setFieldValue(fileName, file?.name, false)
        removeError({
          errors,
          name: contentName,
          setErrors,
        });
      })
      .catch()
  };

  const buildFileSelector = ({
                               setFieldValue,
                               errors,
                               setErrors,
                               contentName = "caFile",
                               fileName = "caFileName",
                               accept = ".pem"
                             }) => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('name', 'file');
    fileSelector.setAttribute('accept', accept);
    fileSelector.onchange = (e) => {
      onChoose(e, setFieldValue, errors, setErrors, contentName, fileName);
      fileSelector.value = ''
    };

    return fileSelector;
  };

  const create = (values, url = '/admin/createServer', isUpdated = false) => {
    if (states.length !== 0 && !values?.state) {
      setErrorState(true)
      return
    }

    POST(url, {...values, adminId: user?.id})
      .then(() => {
        notification.info({
          description: `${values?.country} server was ${isUpdated ? 'updated' : 'created'} successfully`,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification info",
        });
        onCloseServe()
        cb()
      })
      .catch((err) => {
        notification.info({
          description: `${values?.country} server was ${isUpdated ? 'updated' : 'created'} failure`,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification error",
        });
      })
  }

  React.useEffect(() => {

  }, [])

  const isAllow = user?.email && user?.email?.toLowerCase() !== EMAIL

  return (
    <UICPopup
      hiddenFooter={true}
      onCancel={onCloseServe}
      textCancel="Cancel"
      textOk="Save"
      title={`${data ? 'Update' : 'New'} ${isPremium ? 'Premium' : 'Free'} Server`} width={416}>
      <Formik
        onSubmit={(e) => {
          if (isAllow) {
            if (!data) {
              create(e)
            } else {
              create({
                ...e,
                id: data?.id,
                adminId: user?.id
              }, '/admin/updateServer', true)
            }
          }
        }}
        validationSchema={validateSchema}
        initialValues={formData}
        enableReinitialize
      >
        {
          ({setErrors, setFieldValue, errors, values, handleSubmit}) => {

            return (
              <Form onFinish={handleSubmit} className="block w-full">
                <Form.Item
                  hasFeedback={!!errors["country"]}
                  validateStatus={errors["country"] && "error"}
                  help={errors["country"]}
                  className="core-form-item w-full mb-2 block" label="server name">
                  <Select
                    showSearch
                    value={values?.country || undefined}
                    optionFilterProp="children"
                    onChange={(e, a) => {
                      setFieldValue("country", e, false)
                      setFieldValue("countryCode", a?.['data-id'], false)
                      removeError({
                        errors,
                        name: "country",
                        setErrors,
                      });
                      let arrStates = JSON.parse(a?.['data-states'] || "")
                      if (arrStates.length === 0) {
                          arrStates = [{
                            "id": a?.['data-id'],
                            "name": e,
                            "state_code": a?.['data-id']
                          }]
                      }
                      setState(arrStates)
                    }}
                    filterOption={(input, option) => option?.value.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
                    placeholder="Select server name" className="w-full">
                    {
                      countries?.map((item) => (
                        <Select.Option
                          key={item?.id}
                          data-id={(item?.iso2).toLowerCase()}
                          data-states={JSON.stringify(item?.states)}
                          value={item?.name}>
                          <div className="flex items-center">
                            <img className="rounded-full mr-2"
                                 style={{border: "2px solid #f5f5f5"}}
                                 src={`/flags/${(item?.iso2).toLowerCase()}.svg`} width={24}
                                 height={24}/>
                            <div style={{marginTop: 2}}>{item?.name}</div>
                          </div>
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  hasFeedback={errorState}
                  validateStatus={errorState && "error"}
                  help={errorState && "Please select state"}
                  className="core-form-item w-full mb-2 block" label="state">
                  <Select
                    optionFilterProp="children"
                    showSearch
                    filterOption={(input, option) => option?.value.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
                    onChange={(e) => {
                      setFieldValue("state", e, false)
                      setErrorState(false)
                      removeError({
                        errors,
                        name: "state",
                        setErrors,
                      });
                    }}
                    placeholder="Select state"
                    value={values?.state || undefined} className="w-full">
                    {
                      states && states.map((state) => (
                        <Select.Option key={state?.id}
                                       value={state?.name}>{state?.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["status"]}
                  validateStatus={errors["status"] && "error"}
                  help={errors["status"]}
                  className="core-form-item w-full mb-2 block" label="Status">
                  <Select
                    onChange={(value) => {
                      setFieldValue("status", value, false)
                      removeError({
                        errors,
                        name: "status",
                        setErrors,
                      });
                    }}
                    placeholder="Enable" value={values?.status} className="w-full">
                    <Select.Option value={true}>Enable</Select.Option>
                    <Select.Option value={false}>Disabled</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["recommend"]}
                  validateStatus={errors["recommend"] && "error"}
                  help={errors["recommend"]}
                  className="core-form-item w-full mb-2 block" label="Recommend">
                  <Select
                    onChange={(value) => {
                      setFieldValue("recommend", value, false)
                      removeError({
                        errors,
                        name: "recommend",
                        setErrors,
                      });
                    }}
                    placeholder="Recommend" value={values?.recommend} className="w-full">
                    <Select.Option value={true}>True</Select.Option>
                    <Select.Option value={false}>False</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["ipAddress"]}
                  validateStatus={errors["ipAddress"] && "error"}
                  help={errors["ipAddress"]}
                  className="core-form-item w-full mb-2 block" label="ip address">
                  <Input
                    onChange={({target: {value}}) => {
                      setFieldValue("ipAddress", value, false)
                      removeError({
                        errors,
                        name: "ipAddress",
                        setErrors,
                      });
                    }}
                    placeholder="IP address" value={values?.ipAddress} className="w-full"/>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["u_nsm"]}
                  validateStatus={errors["u_nsm"] && "error"}
                  help={errors["u_nsm"]}
                  className="core-form-item w-full mb-2 block" label="Username">
                  <Input
                    onChange={({target: {value}}) => {
                      setFieldValue("u_nsm", value, false)
                      removeError({
                        errors,
                        name: "u_nsm",
                        setErrors,
                      });
                    }}
                    placeholder="Username" value={values?.u_nsm} className="w-full"/>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["p_nsm"]}
                  validateStatus={errors["p_nsm"] && "error"}
                  help={errors["p_nsm"]}
                  className="core-form-item w-full mb-2 block" label="Password">
                  <Input
                    onChange={({target: {value}}) => {
                      setFieldValue("p_nsm", value, false)
                      removeError({
                        errors,
                        name: "p_nsm",
                        setErrors,
                      });
                    }}
                    placeholder="Password" value={values?.p_nsm} className="w-full"/>
                </Form.Item>
                <Form.Item
                  hasFeedback={!!errors["caFile"]}
                  validateStatus={errors["caFile"] && "error"}
                  help={errors["caFile"]}
                  className="core-form-item w-full mb-4 block" label="upload cert file (*.pem)*">
                  <div className="flex">
                    <UIButton
                      className="standard"
                      onClick={() => {
                        if (isAllow) {
                          fileSelector = buildFileSelector({errors, setErrors, setFieldValue})
                          handleFileSelect()
                        }
                      }}>Upload</UIButton>
                    {
                      values?.caFileName && (
                        <div className="ml-3 flex items-center">
                          <div className="text-black pa-13">{values?.caFileName}</div>
                          <img src={CancelIcon} onClick={() => {
                            setFieldValue("caFile", "", false)
                            setFieldValue("caFileName", "", false)
                          }} className="cursor-pointer" alt="" width={24} height={24}/>
                        </div>
                      )
                    }
                  </div>
                </Form.Item>
                <div className="flex justify-end pt-4 border-0 border-t border-solid border-gray-200">
                  <UIButton
                    onClick={onCloseServe} className="ghost border mr-4">Cancel</UIButton>
                  {
                    isAllow && (
                      <UIButton
                        htmlType="submit" className="third">Save</UIButton>
                    )
                  }
                </div>
              </Form>
            )
          }
        }
      </Formik>
    </UICPopup>
  )
}
