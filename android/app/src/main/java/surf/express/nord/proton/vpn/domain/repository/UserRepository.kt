package surf.express.nord.proton.vpn.domain.repository

import surf.express.nord.proton.vpn.domain.model.Ads
import surf.express.nord.proton.vpn.domain.model.Package
import surf.express.nord.proton.vpn.domain.model.User

interface UserRepository {
    suspend fun login(param: MutableMap<String, Any>): User

    suspend fun register(param: MutableMap<String, Any>): User

    suspend fun otp(param: MutableMap<String, Any>): User

    suspend fun profile(param: MutableMap<String, Any>): User

    suspend fun createAnonymousUser(param: MutableMap<String, Any>): User

    suspend fun updateTotalUploadDownload(param: MutableMap<String, Any>): User

    suspend fun packages(param: MutableMap<String, Any>): List<Package>

    suspend fun ads(param: MutableMap<String, Any>): List<Ads>

    suspend fun subscription(param: MutableMap<String, Any>)
}