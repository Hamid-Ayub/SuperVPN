package surf.express.nord.proton.vpn.domain.model

data class Ads(
    var v: Int?,
    var adsId: String?,
    var adsPlatform: String?,
    var adsStatus: Boolean?,
    var adsType: String?,
    var createdAt: String?,
    var id: String?
) {
    companion object {
        fun fromObject(adsObject: surf.express.nord.proton.vpn.data.remote.model.AdsObject): Ads {
            return Ads(
                v = adsObject.v,
                adsId = adsObject.adsId,
                adsPlatform = adsObject.adsPlatform,
                adsStatus = adsObject.adsStatus,
                adsType = adsObject.adsType,
                createdAt = adsObject.createdAt,
                id = adsObject.id
            )
        }
    }
}