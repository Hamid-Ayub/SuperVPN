import React from "react";

const md5 = require('md5');
import {Formik} from "formik";
import {Form, Input, notification} from "antd";
import * as Yup from "yup";
import css from 'styled-jsx/css'

import {LoadingIcon} from "@app/components/core/loading-icon";
import Container from "@app/components/core/container";
import Row from "@app/components/core/row";
import Col from "@app/components/core/col";
import UIButton from "@app/components/core/button";
import {withRouter} from "react-router";
import {LocalStore} from "@app/utils/local-storage";
import {EMAIL, envName} from "@app/configs";
import {LoadingPage} from "@app/components/core/loading";
import Layout from "@app/components/layout";
import {loadUser} from "@app/redux/actions";
import {connect} from "react-redux";
import {POST} from "@app/request";
import {runFunction} from "@app/services/casl/ability";

const styles = css.global`
  .login {
    .login-content {
      width: 416px;
      height: fit-content;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      padding: 16px;
      margin: auto;
      margin-bottom: 16px;
    }
    .title-login {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: left;
      color: #2a2a2c;
      margin-bottom: 18px;
    }
  }
`

const Profile = ({location, history, global: { user }, ...props}) => {
  const [info, setInfo] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  const [isPageLoading, setPageLoading] = React.useState(true)
  const fields = {
    email: "email",
    password: "password",
    firstname: "firstname",
    lastname: "lastname",
    newPasswordConfirm: "passwordConfirm",
    newPassword: "newPassword",
  };

  const [initialValues, setInitialValues] = React.useState({
    [fields.email]: "",
    [fields.password]: "",
    [fields.firstname]: "",
    [fields.lastname]: "",
    [fields.newPassword]: "",
    [fields.newPasswordConfirm]: "",
  })

  const validationSchema = Yup.object({
    [fields.password]: Yup.string()
      .required("Please enter a password")
      .min(8, "Must contain 8 characters"),
    [fields.newPassword]: Yup.string()
      .required("Please enter a new password")
      .min(8, "Must contain 8 characters"),
    [fields.newPasswordConfirm]: Yup.string().required("Please enter a new password confirm").oneOf(
      [Yup.ref('newPassword'), null],
      'Passwords must match',
    ),
  });

  const validationProfileSchema = Yup.object({
    [fields.email]: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
    [fields.firstname]: Yup.string()
      .required("Please enter your first name"),
    [fields.lastname]: Yup.string()
      .required("Please enter your last name"),
  });

  React.useEffect(() => {
    setInitialValues({
      ...initialValues,
      email: user?.email,
      password: "",
      firstname: user?.firstname,
      lastname: user?.lastname,
    })
  }, [])

  const removeError = ({errors, name, setErrors}) => {
    const newErrors = {...errors};
    delete newErrors?.[name];
    setErrors({...newErrors});
  };

  const saveProfile = (formData) => {
    setLoading({
      ...isLoading,
      profile: true
    })
    if (user?.id) {
      POST('/admin/updateProfile', {
        firstname: formData?.firstname,
        lastname: formData?.lastname,
        adminId: user?.id
      })
        .then(() => {
          setLoading({
            ...isLoading,
            profile: false
          })
          notification.info({
            description: `Profile was updated successfully`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification info",
            onClose: () => {
              LocalStore.local.set(`${envName}-uuid`, {
                ...user,
                firstname: formData?.firstname,
                lastname: formData?.lastname,
              })
              props?.loadUser()
            }
          });
        })
        .catch(() => {
          setLoading({
            ...isLoading,
            profile: false
          })
          notification.info({
            description: `Profile was updated failure`,
            placement: "bottomRight",
            duration: 2,
            icon: "",
            className: "core-notification error",
          });
        })
    }
  }

  const changePass = (formData) => {
    setLoading({
      ...isLoading,
      password: true
    })

    POST('/admin/updatePassword', {
      adminId: user?.id,
      password: formData.newPassword,
      oldPassword: formData.password,
    })
      .then(() => {
        setLoading({
          ...isLoading,
          password: false
        })
        notification.info({
          description: `Password was updated successfully`,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification info",
          onClose: () => {
            setInitialValues({
              ...initialValues,
              newPassword: "",
              newPasswordConfirm: "",
              password: "",
            })
            props?.loadUser()
          }
        });
      })
      .catch((error) => {
        setLoading({
          ...isLoading,
          password: false
        })
        notification.info({
          description: error.message,
          placement: "bottomRight",
          duration: 2,
          icon: "",
          className: "core-notification error",
        });
      })
  }

  return (
    <Layout title="Admin" className="login flex justify-center h-screen">
      <Container>
        <Row>
          <Col className="col-sm-3"/>
          <Col className="col-sm-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationProfileSchema}
              onSubmit={(e) => {
                runFunction({
                  email: user.email,
                  cb: () => {
                    saveProfile(e)
                  }
                })
              }}
              enableReinitialize
            >
              {(form) => {
                const {
                  values,
                  errors,
                  handleSubmit,
                  setFieldValue,
                  setErrors,
                } = form;

                return (
                  <Form onFinish={handleSubmit}>
                    <div className="login-content">
                      <div className="title-login">
                        Profile
                      </div>
                      <div className="flex">
                        <Form.Item
                          className="core-form-item w-full block mb-3 mr-2 flex-1"
                          label="First name"
                          hasFeedback={!!errors[fields.firstname]}
                          validateStatus={errors[fields.firstname] && "error"}
                          help={errors[fields.firstname]}
                        >
                          <Input
                            name={fields.firstname}
                            placeholder="First name"
                            value={values[fields.firstname]}
                            onChange={({target: {value}}) => {
                              setFieldValue(fields.firstname, value, false);
                              removeError({
                                errors,
                                name: fields.firstname,
                                setErrors,
                              });
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          className="core-form-item w-full block mb-3 ml-2 flex-1"
                          label="Last name"
                          hasFeedback={!!errors[fields.lastname]}
                          validateStatus={errors[fields.lastname] && "error"}
                          help={errors[fields.lastname]}
                        >
                          <Input
                            name={fields.lastname}
                            placeholder="Last name"
                            value={values[fields.lastname]}
                            onChange={({target: {value}}) => {
                              setFieldValue(fields.lastname, value, false);
                              removeError({
                                errors,
                                name: fields.lastname,
                                setErrors,
                              });
                            }}
                          />
                        </Form.Item>
                      </div>
                      <Form.Item
                        className="core-form-item w-full block mb-3"
                        label="Email"
                        hasFeedback={!!errors[fields.email]}
                        validateStatus={errors[fields.email] && "error"}
                        help={errors[fields.email]}
                      >
                        <Input
                          disabled
                          name={fields.email}
                          placeholder="email@example.com"
                          value={values[fields.email]}
                          onChange={({target: {value}}) => {
                            // setFieldValue(fields.email, value, false);
                            // removeError({
                            //   errors,
                            //   name: fields.email,
                            //   setErrors,
                            // });
                          }}
                        />
                      </Form.Item>
                      <div className="flex mt-10 justify-end">
                        <UIButton
                          disabled={isLoading?.profile}
                          htmlType="submit"
                          className="third capitalize filled-error w-1/3">
                          {isLoading?.profile && <LoadingIcon/>}
                          save change
                        </UIButton>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(e) => {
                runFunction({
                  email: user.email,
                  cb: () => {
                    changePass(e)
                  }
                })
              }}
            >
              {(form) => {
                const {
                  values,
                  errors,
                  handleSubmit,
                  setFieldValue,
                  setErrors,
                } = form;

                return (
                  <Form onFinish={handleSubmit}>
                    <div className="login-content">
                      <div className="title-login">
                        Change password
                      </div>
                      <Form.Item
                        label="old password"
                        className="core-form-item w-full block mb-3"
                        validateStatus={
                          errors[fields.password] && "error"
                        }
                        help={errors[fields.password]}
                      >
                        <Input
                          type="password"
                          name={fields.password}
                          placeholder="*****"
                          value={values[fields.password]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.password, value, false);
                            removeError({
                              errors,
                              name: fields.password,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="new password"
                        className="core-form-item w-full block mb-3"
                        validateStatus={
                          errors[fields.newPassword] && "error"
                        }
                        help={errors[fields.newPassword]}
                      >
                        <Input
                          type="password"
                          name={fields.newPassword}
                          placeholder="*****"
                          value={values[fields.newPassword]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.newPassword, value, false);
                            removeError({
                              errors,
                              name: fields.newPassword,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="confirm new password"
                        className="core-form-item w-full block"
                        validateStatus={
                          errors[fields.newPasswordConfirm] && "error"
                        }
                        help={errors[fields.newPasswordConfirm]}
                      >
                        <Input
                          type="password"
                          name={fields.newPasswordConfirm}
                          placeholder="*****"
                          value={values[fields.newPasswordConfirm]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.newPasswordConfirm, value, false);
                            removeError({
                              errors,
                              name: fields.newPasswordConfirm,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <div className="flex mt-10 justify-end">
                        <UIButton
                          disabled={isLoading?.password}
                          htmlType="submit"
                          className="third capitalize filled-error w-1/3">
                          {isLoading?.password && <LoadingIcon/>}
                          save change
                        </UIButton>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Col>
          <Col className="col-sm-3"/>
        </Row>
      </Container>
      {/*{isPageLoading && <LoadingPage/>}*/}
      <style jsx>{styles}</style>
    </Layout>
  )
}

const mapDispatchToProps = ({
  loadUser,
})

export default connect(state => state, mapDispatchToProps)(withRouter(Profile));
