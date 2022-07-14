package surf.express.nord.proton.vpn.presentation.ui.servers

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import surf.express.nord.proton.vpn.domain.model.Resource
import surf.express.nord.proton.vpn.domain.model.Server
import surf.express.nord.proton.vpn.domain.model.User
import surf.express.nord.proton.vpn.domain.repository.ServerRepository
import surf.express.nord.proton.vpn.presentation.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ServersViewModel @Inject constructor(private val serverRepository: ServerRepository) :
    BaseViewModel() {
    private val _serversMutableLiveData = MutableLiveData<Resource<List<Server>>>()

    fun getServers(): LiveData<Resource<List<Server>>> = _serversMutableLiveData

    fun execute(user: User) {
        viewModelScope.launch(exceptionHandler) {
            _serversMutableLiveData.postValue(Resource.loading(null))
            val param = mutableMapOf(
                "userId" to user.id as Any
            )
            val servers = serverRepository.getServers(param)
            _serversMutableLiveData.postValue(Resource.success(servers))
        }
    }
}