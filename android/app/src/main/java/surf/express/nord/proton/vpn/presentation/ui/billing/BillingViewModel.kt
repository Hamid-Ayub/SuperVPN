package surf.express.nord.proton.vpn.presentation.ui.billing

import android.app.Activity
import android.content.Context
import androidx.lifecycle.viewModelScope
import com.android.billingclient.api.*
import surf.express.nord.proton.vpn.domain.model.User
import surf.express.nord.proton.vpn.presentation.base.BaseViewModel
import surf.express.nord.proton.vpn.presentation.utils.LiveEvent
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class BillingViewModel @Inject constructor(@ApplicationContext private val context: Context) :
    BaseViewModel(), PurchasesUpdatedListener, BillingClientStateListener {

    private var billingClient: BillingClient = BillingClient.newBuilder(context)
        .enablePendingPurchases()
        .setListener(this)
        .build()

    private var user: User? = null

    val purchasedLiveEvent: LiveEvent<Pair<Boolean, Purchase>> = LiveEvent()
    val skuDetailsListLiveEvent: LiveEvent<MutableList<SkuDetails>?> = LiveEvent()
    val skuDetailsList: MutableList<SkuDetails>
        get() {
            return skuDetailsListLiveEvent.value ?: mutableListOf()
        }

    fun connect(user: User?) {
        this.user = user
        if (billingClient.isReady) {
            return
        }
        billingClient.startConnection(this)
    }

    fun getPremium(activity: Activity?, monthly: Boolean, action: Int) {

        viewModelScope.launch {
            if (skuDetailsList.isEmpty()) {
                return@launch
            }
            val index = if (monthly) 0 else 1
            val skuDetails = skuDetailsList[index]

            var oldSku: SkuDetails? = null
            if (action != BillingFragment.ACTION_GET) {
                oldSku = skuDetailsList.first { it.sku != skuDetails.sku }
            }

            val flowParams = BillingFlowParams.newBuilder()
                .setSkuDetails(skuDetails)

            if (oldSku != null) {

            }

            billingClient.launchBillingFlow(activity!!, flowParams.build())
        }

    }

    private fun querySkuDetailsAsync() {
        val packageIds = user?.packages?.map { return@map it.packageId } ?: listOf()

        val params = SkuDetailsParams.newBuilder()
            .setSkusList(packageIds)
            .setType(BillingClient.SkuType.SUBS)
            .build()

        billingClient.querySkuDetailsAsync(params) { billingResult, skuDetailsList ->
            when (billingResult.responseCode) {
                BillingClient.BillingResponseCode.OK -> {
                    skuDetailsListLiveEvent.postValue(skuDetailsList)
                    queryPurchasesAsync()
                }
            }
        }
    }

    private fun queryPurchasesAsync() {
        viewModelScope.launch(Dispatchers.IO + exceptionHandler) {
            if (isSubscriptionSupported()) {
                val purchasesList =
                    billingClient.queryPurchases(BillingClient.SkuType.SUBS).purchasesList
                        ?: return@launch
                processPurchases(purchasesList, false)
            }
        }
    }

    private suspend fun processPurchases(
        purchasesResult: MutableList<Purchase>?,
        isNewRequest: Boolean = false
    ) {
        withContext(Dispatchers.IO + exceptionHandler) {
            val purchase = purchasesResult?.firstOrNull { !it.isAcknowledged } ?: return@withContext

            val params = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.purchaseToken)
                .build()

            billingClient.acknowledgePurchase(params) { billingResult ->
                when (billingResult.responseCode) {
                    BillingClient.BillingResponseCode.OK -> {
                        purchasedLiveEvent.postValue(Pair(isNewRequest, purchase))
                    }
                }
            }
        }
    }

    override fun onPurchasesUpdated(p0: BillingResult, p1: MutableList<Purchase>?) {
        when (p0.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                // will handle server verification, consumables, and updating the local cache
                viewModelScope.launch(Dispatchers.IO + exceptionHandler) {
                    processPurchases(p1, true)
                }
            }
            BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED -> {
                // item already owned? call queryPurchasesAsync to verify and process all such items
                queryPurchasesAsync()
            }
            BillingClient.BillingResponseCode.SERVICE_DISCONNECTED -> {
                connect(user)
            }
            else -> {
                Timber.d(p0.debugMessage)
            }
        }
    }

    override fun onBillingSetupFinished(p0: BillingResult) {
        when (p0.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                querySkuDetailsAsync()
            }
            else -> {
                Timber.d(p0.debugMessage)
            }
        }
    }

    override fun onBillingServiceDisconnected() {
        connect(user)
    }

    override fun onCleared() {
        super.onCleared()
        billingClient.endConnection()
    }

    private fun isSubscriptionSupported(): Boolean {
        val billingResult =
            billingClient.isFeatureSupported(BillingClient.FeatureType.SUBSCRIPTIONS)

        return when (billingResult.responseCode) {
            BillingClient.BillingResponseCode.SERVICE_DISCONNECTED -> {
                connect(user)
                false
            }
            BillingClient.BillingResponseCode.OK -> true
            else -> {
                Timber.w("isSubscriptionSupported() error: ${billingResult.debugMessage}")
                false
            }
        }
    }
}