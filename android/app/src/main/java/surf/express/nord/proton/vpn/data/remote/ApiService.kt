package surf.express.nord.proton.vpn.data.remote

import retrofit2.http.FieldMap
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface ApiService {
    @POST("user/server")
    @FormUrlEncoded
    suspend fun getServers(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.ServersResponse

    @POST("user/login")
    @FormUrlEncoded
    suspend fun login(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.LoginResponse

    @POST("user/signup")
    @FormUrlEncoded
    suspend fun signup(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.LoginResponse

    @POST("user/otp")
    @FormUrlEncoded
    suspend fun otp(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.LoginResponse

    @POST("user/profile")
    @FormUrlEncoded
    suspend fun profile(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.LoginResponse

    @POST("user/loginAnonymousUser")
    @FormUrlEncoded
    suspend fun createAnonymousUser(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.LoginResponse

    @POST("user/updateTotalUploadDownload")
    @FormUrlEncoded
    suspend fun updateTotalUploadDownload(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.LoginResponse

    @POST("user/packages")
    @FormUrlEncoded
    suspend fun packages(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.PackagesResponse

    @POST("user/ads")
    @FormUrlEncoded
    suspend fun ads(@FieldMap param: MutableMap<String, Any>): surf.express.nord.proton.vpn.data.remote.model.AdsResponse

    @POST("user/subscription")
    @FormUrlEncoded
    suspend fun subscription(@FieldMap param: MutableMap<String, Any>)
}