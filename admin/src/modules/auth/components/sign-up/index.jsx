import React from "react";
import {Formik} from "formik";
import {Form, Input} from "antd";
import * as Yup from "yup";
import css from 'styled-jsx/css'
import {withRouter} from "react-router";

import {LoadingIcon} from "@app/components/core/loading-icon";
import Container from "@app/components/core/container";
import Row from "@app/components/core/row";
import Col from "@app/components/core/col";
import UIButton from "@app/components/core/button";
import Layout from "@app/components/layout";
import {POST} from "@app/request";

const styles = css.global`
  .login {
    background: url("/images/bg_login.svg");
    background-size: cover;
    background-repeat: no-repeat;
    padding-top: 120px;
    .login-content {
      width: 416px;
      height: fit-content;
      border-radius: 4px;
      border: solid 1px #e0e0e0;
      background-color: #ffffff;
      padding: 16px;
      margin: auto;
    }
    .title-login {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.25;
      letter-spacing: normal;
      text-align: center;
      color: #2a2a2c;
      margin-bottom: 18px;
    }
  }
`

const Login = ({location, history, ...props}) => {
  const [error, setError] = React.useState("")
  const [isLoading, setLoading] = React.useState(false)
  const fields = {
    email: "email",
    password: "password",
    lastname: "lastname",
    firstname: "firstname",
  };

  const initialValues = {
    [fields.email]: "",
    [fields.password]: "",
    [fields.lastname]: "",
    [fields.firstname]: "",
  };

  const validationSchema = Yup.object({
    [fields.email]: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
    [fields.password]: Yup.string()
      .required("Please enter a password")
      .min(8, "Must contain 8 characters"),
    [fields.lastname]: Yup.string()
      .required("Please enter your last name"),
    [fields.firstname]: Yup.string()
      .required("Please enter your first name")
  });

  const onHandleSubmit = async (formValues) => {
    setLoading(true)
    checkIsAdmin(formValues)
  };

  const signup = (formValues) => {
    POST('/admin/signup', {
      ...formValues
    })
      .then((result) => {
        setLoading(false)
        history.push('/login')
      })
      .catch((error) => {
        setError("Something wrong")
        setLoading(false)
      })
  }

  const checkIsAdmin = (formValues) => {
    // firestore.collection("admin").where("email", "==", formValues?.email).get()
    //   .then((result) => {
    //     if (result.docs.length > 0) {
    //         login(formValues)
    //     } else {
    //       setLoading(false)
    //       setError("Email and password don’t match")
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false)
    //     setError("Email and password don’t match")
    //   })
  }

  const removeError = ({errors, name, setErrors}) => {
    const newErrors = {...errors};
    delete newErrors?.[name];
    setErrors({...newErrors});
  };

  return (
    <Layout title="Sign up" className="login flex justify-center h-screen">
      <Container>
        <Row>
          <Col className="col-sm-3"/>
          <Col className="col-sm-6">
            <div className="login-content">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={signup}
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
                      <div className="title-login">
                        Sign Up
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
                          name={fields.email}
                          placeholder="email@example.com"
                          value={values[fields.email]}
                          onChange={({target: {value}}) => {
                            setFieldValue(fields.email, value, false);
                            removeError({
                              errors,
                              name: fields.email,
                              setErrors,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Mật khẩu"
                        className="core-form-item w-full block"
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
                      <div className="flex mt-10">
                        <UIButton
                          disabled={isLoading}
                          htmlType="submit"
                          className="third capitalize filled-error flex-1">
                          {isLoading && <LoadingIcon/>}
                          Sign Up
                        </UIButton>
                        {/*<Link to="/request-password" className=" flex-1">*/}
                        {/*  <UIButton*/}
                        {/*    className="gray capitalize filled-error flex-1">*/}
                        {/*    Forgot Password?*/}
                        {/*  </UIButton>*/}
                        {/*</Link>*/}
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            {
              error && (
                <div className="core-alert flex items-center">
                  <div>
                    <i className="far fa-exclamation-triangle"/>
                  </div>
                  <div>{error}</div>
                </div>
              )
            }
          </Col>
          <Col className="col-sm-3"/>
        </Row>
      </Container>
      <style jsx>{styles}</style>
    </Layout>
  )
}

export default withRouter(Login)
