package surf.express.nord.proton.vpn.presentation.utils.connectivity

import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.os.Build
import androidx.annotation.RequiresApi
import android.net.ConnectivityManager.NetworkCallback
import surf.express.nord.proton.vpn.presentation.utils.connectivity.ConnectivityProvider.NetworkState
import surf.express.nord.proton.vpn.presentation.utils.connectivity.ConnectivityProvider.NetworkState.ConnectedState.Connected
import surf.express.nord.proton.vpn.presentation.utils.connectivity.ConnectivityProvider.NetworkState.NotConnectedState


@RequiresApi(Build.VERSION_CODES.N)
class ConnectivityProviderImpl(private val cm: ConnectivityManager) :
    ConnectivityProviderBaseImpl() {

    private val networkCallback = ConnectivityCallback()

    override fun subscribeListener() {
        cm.registerDefaultNetworkCallback(networkCallback)
    }

    override fun getNetworkState(): NetworkState {
        val capabilities = cm.getNetworkCapabilities(cm.activeNetwork)
        return if (capabilities != null) {
            Connected(capabilities)
        } else {
            NotConnectedState
        }
    }

    private inner class ConnectivityCallback : NetworkCallback() {

        override fun onCapabilitiesChanged(network: Network, capabilities: NetworkCapabilities) {
            dispatchChange(Connected(capabilities))
        }

        override fun onLost(network: Network) {
            dispatchChange(NotConnectedState)
        }
    }
}