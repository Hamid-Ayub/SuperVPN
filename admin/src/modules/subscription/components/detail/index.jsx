import {Form, Input, notification, Select} from "antd";
import UICPopup from "@app/components/core/popup/cpopup";
import React from "react";
import * as Yup from "yup";
import CurrencyFormat from 'react-currency-format';
import {Formik} from "formik";
import UIButton from "@app/components/core/button";
import {removeError} from "@app/utils";
import {POST, PUT} from "@app/request";

export const PackDetail = ({onClose, cb, data = undefined, user}) => {
  const [formData, setFormData] = React.useState({
    packageName: undefined,
    packagePricing: undefined,
    packagePlatform: undefined,
    packageId: undefined,
    packageDuration: undefined,
  });

  const validateSchema = Yup.object({
    packagePricing: Yup.number().required("Please input pricing"),
    packageId: Yup.string().required("Please input purchase id"),
    packageName: Yup.string().required("Please input package name"),
    packageDuration: Yup.string().required("Please choose duration"),
  });

  React.useEffect(() => {
    if (data) {
      setFormData({
        packageName: data?.packageName,
        packagePricing: data?.packagePricing,
        packageDuration: data?.packageDuration,
        packagePlatform: data?.packagePlatform,
        packageId: data?.packageId,
      });
    }
  }, []);

  const update = (form) => {
    PUT(`/admin/updatePackage/${data.id}`, {
      ...form,
      adminId: user?.id
    }).then((data) => {
      notification.info({
        description: `Package was updated successfully`,
        placement: "bottomRight",
        duration: 2,
        icon: "",
        className: "core-notification info",
      });
      onClose()
      cb()
    })
      .catch((err) => {
        notification.info({
          description: `Package was updated failure`,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification error",
        })
      })
  }

  return (
    <UICPopup
      hiddenFooter={true}
      onCancel={onClose}
      textCancel="Cancel"
      textOk="Save"
      title={`${data ? "Update" : "New"} Pack`}
      width={416}
    >
      <Formik
        onSubmit={(e) => {
          update(e);
        }}
        validationSchema={validateSchema}
        initialValues={formData}
        enableReinitialize
      >
        {({setErrors, setFieldValue, errors, values, handleSubmit}) => {

          return (
            <Form onFinish={handleSubmit} className="block w-full">
              <Form.Item
                hasFeedback={!!errors["packageName"]}
                validateStatus={errors["packageName"] && "error"}
                help={errors["packageName"]}
                className="core-form-item w-full mb-2 block"
                label="Pack name"
              >
                <Input
                  onChange={({target: {value}}) => {
                    setFieldValue("packageName", value, false);
                    removeError({
                      errors,
                      name: "packageName",
                      setErrors,
                    });
                  }}
                  placeholder="Pack name"
                  value={values?.packageName}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                hasFeedback={!!errors["packagePricing"]}
                validateStatus={errors["packagePricing"] && "error"}
                help={errors["packagePricing"]}
                className="core-form-item w-full mb-2 block"
                label="pricing"
              >
                <CurrencyFormat
                  style={{padding: '4px 11px'}}
                  thousandSeparator={true}
                  prefix={'$'}
                  onValueChange={({formattedValue, value}) => {
                    setFieldValue("packagePricing", parseFloat(value) || 0, false);
                    removeError({
                      errors,
                      name: "packagePricing",
                      setErrors,
                    });
                  }}
                  placeholder="Pricing"
                  value={values?.packagePricing}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                hasFeedback={!!errors["packageDuration"]}
                validateStatus={errors["packageDuration"] && "error"}
                help={errors["packageDuration"]}
                className="core-form-item w-full mb-2 block"
                label="Duration"
              >
                <Select
                  disabled
                  // onChange={(value) => {
                  //   setFieldValue("duration", value, false)
                  //   removeError({
                  //     errors,
                  //     name: "duration",
                  //     setErrors,
                  //   });
                  // }}
                  placeholder="Duration" value={values?.packageDuration} className="w-full">
                  <Select.Option value={""}>Choose</Select.Option>
                  {
                    values?.packagePlatform === "iOS"
                      ? (
                        <>
                          <Select.Option value={"1 Week"}>1 Week</Select.Option>
                          <Select.Option value={"1 Month"}>1 Month</Select.Option>
                          <Select.Option value={"2 Months"}>2 Months</Select.Option>
                          <Select.Option value={"3 Months"}>3 Months</Select.Option>
                          <Select.Option value={"6 Months"}>6 Months</Select.Option>
                          <Select.Option value={"1 Year"}>1 Year</Select.Option>
                        </>
                      )
                      : (
                        <>
                          <Select.Option value={"Weekly"}>Weekly</Select.Option>
                          <Select.Option value={"Every 4 weeks"}>Every 4 weeks</Select.Option>
                          <Select.Option value={"Monthly"}>Monthly</Select.Option>
                          <Select.Option value={"Every 3 months"}>Every 3 months</Select.Option>
                          <Select.Option value={"Every 6 months"}>Every 6 months</Select.Option>
                          <Select.Option value={"Yearly"}>Yearly</Select.Option>
                        </>
                      )
                  }
                </Select>
              </Form.Item>
              <Form.Item
                hasFeedback={!!errors["packageId"]}
                validateStatus={errors["packageId"] && "error"}
                help={errors["packageId"]}
                className="core-form-item w-full mb-2 block"
                label="purchase id"
              >
                <Input
                  onChange={({target: {value}}) => {
                    setFieldValue("packageId", value, false);
                    removeError({
                      errors,
                      name: "packageId",
                      setErrors,
                    });
                  }}
                  placeholder="Purchase id"
                  value={values?.packageId}
                  className="w-full"
                />
              </Form.Item>
              <Form.Item
                hasFeedback={!!errors["packagePlatform"]}
                validateStatus={errors["packagePlatform"] && "error"}
                help={errors["packagePlatform"]}
                className="core-form-item w-full mb-2 block"
                label="Os"
              >
                <Select
                  disabled
                  placeholder="Os" value={values?.packagePlatform} className="w-full">
                  <Select.Option value={"Android"}>Android</Select.Option>
                  <Select.Option value={"iOS"}>iOS</Select.Option>
                </Select>
              </Form.Item>
              <div className="flex justify-end pt-4 border-0 border-t border-solid border-gray-200">
                <UIButton onClick={onClose} className="ghost border mr-4">
                  Cancel
                </UIButton>
                <UIButton
                  htmlType="submit"
                  className="third"
                >
                  Save
                </UIButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </UICPopup>
  );
}
