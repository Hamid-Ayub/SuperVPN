package surf.express.nord.proton.vpn.presentation.ui

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.SkuDetails
import surf.express.nord.proton.vpn.domain.model.Resource
import surf.express.nord.proton.vpn.domain.model.Server
import surf.express.nord.proton.vpn.domain.model.Status
import surf.express.nord.proton.vpn.domain.model.User
import surf.express.nord.proton.vpn.domain.repository.UserRepository
import surf.express.nord.proton.vpn.presentation.base.BaseViewModel
import surf.express.nord.proton.vpn.presentation.utils.parseCertificate
import surf.express.nord.proton.vpn.presentation.utils.storeCertificate
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.strongswan.android.data.VpnProfile
import org.strongswan.android.data.VpnProfileDataSource
import org.strongswan.android.data.VpnType
import timber.log.Timber
import java.lang.Exception
import javax.inject.Inject

@HiltViewModel
class ShareViewModel @Inject constructor(
    private val dataSource: VpnProfileDataSource,
    private val userRepos: UserRepository
) : BaseViewModel() {
    private val _userMutableLiveData = MutableLiveData<User>()
    val userLiveData: LiveData<User> = _userMutableLiveData
    val user: User?
        get() = userLiveData.value

    private val _serverMutableLiveData = MutableLiveData<Resource<Server?>>()
    val serverLiveData: LiveData<Resource<Server?>> = _serverMutableLiveData

    private val _purchaseMutableLiveData = MutableLiveData<Resource<Purchase>>()
    val purchaseLiveData: LiveData<Resource<Purchase>> = _purchaseMutableLiveData
    val isPremium: Boolean
        get() = purchaseLiveData.value?.data != null

    init {
        initServer()
    }

    private fun initServer() {
        purchaseLiveData.observeForever {
            val serverDraft = Server.getDraft()
            if (it.status != Status.SUCCESS && serverDraft?.premium == true) {
                return@observeForever
            }
            _serverMutableLiveData.postValue(Resource.success(serverDraft))
        }
    }

    fun execute(server: Server?) {
        viewModelScope.launch(Dispatchers.IO + exceptionHandler) {
            _serverMutableLiveData.postValue(Resource.loading(server))
            dataSource.open()
            val certificate = server?.ca_file?.parseCertificate()
            certificate?.storeCertificate()

            val vpnProfile = VpnProfile()
                .apply {
                    gateway = server?.ipAddress
                    vpnType = VpnType.IKEV2_EAP
                    name = server?.ipAddress
                    username = server?.u_nsm
                    password = server?.p_nsm
                }

            server?.uuid = vpnProfile.uuid.toString()

            dataSource.insertProfile(vpnProfile)
            _serverMutableLiveData.postValue(Resource.success(server))
            dataSource.close()
        }
    }

    fun setUser(data: User?) {
        _userMutableLiveData.postValue(data)
    }

    //region#SkuDetails
    private val _skuDetailsMutableLiveData = MutableLiveData<List<SkuDetails>>()
    val skuDetailsLiveData: LiveData<List<SkuDetails>> = _skuDetailsMutableLiveData
    val skuDetails: List<SkuDetails>
        get() {
            return skuDetailsLiveData.value ?: listOf()
        }

    fun updateSkuDetailsList(skuDetails: List<SkuDetails>) {
        _skuDetailsMutableLiveData.postValue(skuDetails)
    }
    //endregion

    //region#Purchase

    fun updatePurchase(purchase: Purchase?) {
        Timber.i("updatePurchase: $purchase")

        val result = if (purchase == null) {
            Resource.error("Ops...", purchase)
        } else {
            Resource.success(purchase)
        }
        _purchaseMutableLiveData.postValue(result)
    }


    fun updateSubscription(param: MutableMap<String, Any>, callback: () -> Unit) {
        viewModelScope.launch {
            try {
                userRepos.subscription(param = param)
            } catch (ex: Exception) {
                Timber.e(ex)
            } finally {
                callback.invoke()
            }
        }
    }
    //endregion
}