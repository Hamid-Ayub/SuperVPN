package surf.express.nord.proton.vpn.data.repository

import surf.express.nord.proton.vpn.domain.model.Server
import surf.express.nord.proton.vpn.domain.repository.ServerRepository
import javax.inject.Inject

class ServerRepositoryImpl @Inject constructor() : ServerRepository {
    @Inject
    lateinit var apiService: surf.express.nord.proton.vpn.data.remote.ApiService

    override suspend fun getServers(param: MutableMap<String, Any>): List<Server> {
        val serversResponse = apiService.getServers(param)
        return serversResponse.data.map { return@map Server.fromObject(it) }
    }

}