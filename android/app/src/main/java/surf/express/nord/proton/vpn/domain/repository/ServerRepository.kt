package surf.express.nord.proton.vpn.domain.repository

import surf.express.nord.proton.vpn.domain.model.Server

interface ServerRepository {
    suspend fun getServers(param: MutableMap<String, Any>): List<Server>
}