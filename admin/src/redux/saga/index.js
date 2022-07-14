import {LocalStore} from "@app/utils/local-storage";
import {envName} from "@app/configs";
import {call, delay, put, select, takeLatest} from "@redux-saga/core/effects";
import {AppConst} from "@app/redux/reducers";
import {removeLoading} from "@app/utils";
import {POST} from "@app/request";
import history from "@app/utils/history";

const getRouter = (state) => state.router;

function* profile() {
  return yield POST('/admin/profile')
}

function* loadUser() {
  const router = yield select(getRouter);

  const user = LocalStore.local.get(`${envName}-uuid`);

  const {data: hasAdminUser} = yield call(profile);
  console.log(hasAdminUser)
  if (!hasAdminUser?.data && !['/sign-up']?.includes(router?.location?.pathname)) {
    LocalStore.local.remove(`${envName}-uuid`);
    history?.replace('/sign-up')

    return
  }

  if (!user || Object.values(user).length === 0) {
    yield put({
      type: AppConst.LOAD_USER_ERROR,
    });
    yield delay(1); // Add delay
    yield redirectToAuth({isHasAdminUser: hasAdminUser?.data, isLogin: false, pathname: router?.location?.pathname})
    return;
  }

  if (user && user?.id) {
    yield put({
      type: AppConst.LOAD_USER_SUCCESS,
      payload: {
        ...user,
        camera: true,
        audio: true
      },
    });

    yield redirectToAuth({isHasAdminUser: hasAdminUser?.data, isLogin: true, pathname: router?.location?.pathname})
  }
  removeLoading();
}

function* redirectToAuth({isHasAdminUser = true, isLogin, pathname}) {

  console.log({pathname})
  if (['/login', '/sign-up']?.includes(pathname) && isLogin && isHasAdminUser) {
    history?.replace('/')
  } else if (isHasAdminUser && !isLogin && !(["/success", "/request-password", '/change-password', '/request-password', '/login']?.includes(pathname))) {
    history?.replace('/login')
  }
}

export default function* AppSaga() {
  yield takeLatest(AppConst.LOAD_USER, loadUser);
}
