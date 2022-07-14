package surf.express.nord.proton.vpn.presentation.ui.otp

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import surf.express.nord.proton.vpn.domain.model.Resource
import surf.express.nord.proton.vpn.domain.model.User
import surf.express.nord.proton.vpn.domain.repository.UserRepository
import surf.express.nord.proton.vpn.presentation.base.BaseViewModel
import surf.express.nord.proton.vpn.presentation.utils.SharePrefs
import surf.express.nord.proton.vpn.presentation.utils.putStringPref
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ConfirmOTPViewModel @Inject constructor(private val userRepository: UserRepository) :
    BaseViewModel() {
    private val _signUpStateMutableLiveData = MutableLiveData<Resource<Boolean>>()
    private val _loginStateMutableLiveData = MutableLiveData<Resource<User?>>()

    fun signUp(email: String) {
        _signUpStateMutableLiveData.postValue(Resource.loading(false))
        viewModelScope.launch(exceptionHandler) {
            val param = mutableMapOf(
                "email" to email as Any
            )
            userRepository.register(param)
            _signUpStateMutableLiveData.postValue(Resource.success(true))
        }
    }

    fun login(code: String, email: String) {
        _loginStateMutableLiveData.postValue(Resource.loading(null))
        viewModelScope.launch(exceptionHandler) {
            val param = mutableMapOf(
                "email" to email as Any,
                "code" to code
            )
            val user = userRepository.otp(param)
            user.id?.let { userId ->
                putStringPref(SharePrefs.KEY_USER_ID, userId)
            }
            _loginStateMutableLiveData.postValue(Resource.success(user))
        }
    }

    fun getSignUpState(): LiveData<Resource<Boolean>> = _signUpStateMutableLiveData
    fun getLoginState(): LiveData<Resource<User?>> = _loginStateMutableLiveData

    override fun handleError(msg: String?) {
        _signUpStateMutableLiveData.postValue(Resource.error(msg, false))
        _loginStateMutableLiveData.postValue(Resource.error(msg, null))
    }

}